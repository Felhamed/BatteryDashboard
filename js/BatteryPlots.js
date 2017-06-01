//These are variables that must have global scope
var gd;
var Date1;
var Date2;
var UpdateStartStop;
var LoadTablePressed = 0;
var LoadGraphPressed = 0;

//This portion is all for making the plotly charts change when a window/div is resized.
$(document).ready(function() { //When the document loads: 
	var d3 = Plotly.d3;

	var WIDTH_IN_PERCENT_OF_PARENT = 85,
		HEIGHT_IN_PERCENT_OF_PARENT = 80;

	var gd3 = d3.select("div[id='plotly-div']")
		.append('div')
		.style({
			width: WIDTH_IN_PERCENT_OF_PARENT + '%',
			'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',

			height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
			'margin-bottom': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh',
			'margin-top': 0 + 'vh'
		});

	gd = gd3.node();

	//This segment just makes both divs invisible and hidden to start
	$("#plotly-div").fadeOut(0);
	$("#table-div").fadeOut(0);
	console.log("READY!");


});

//On clicking the "load table" button:
$("#PullTable").click(function() {

	//Disable both buttons until the function is finished loading the table to avoid errors/spamming
	$("#PullGraph").prop('disabled', true);
	$("#PullTable").prop('disabled', true);
	//Set this value to 1 so we know the load table button has been pressed
	LoadTablePressed = 1;

	//If the plotly graphs have been loaded before, then clear them:
	if (LoadGraphPressed === 1) {
		//Clear the graph pressed variable, and clear/fade out the graphs now
		LoadGraphPressed = 0;
		clearTimeout(UpdateStartStop); //Stop the live graph updating
		$("#plotly-div").fadeOut(500, function() {
			Plotly.purge(gd); //Clear graphs
			window.onresize = function() {};
		});

	}

	//load the table using an AJAX call to the server side php script
    (function tabajaxcall() {
	$.ajax({
		url: "php/TableQuery.php",
		success: function(result) {
			$("#table-div").html(result);
			$("#table-div").fadeIn(500);

			//Potential space for future code to auto-update table 
			//This can be done with setInterval or a simple "recursive" call and setTimeout. 
		}
	});
        UpdateTable = setTimeout(tabajaxcall, 10000);
    }());

	//Re-activate the "load graph" button so user can switch between the table currently loaded and graphs
	$("#PullGraph").prop('disabled', false);

});


//On clicking the "load graphs" button:
$("#PullGraph").click(function() {

	//Disable both buttons until the function is finished loading the table to avoid errors/spamming
	$("#PullGraph").prop('disabled', true);
	$("#PullTable").prop('disabled', true);
	//Set this value to 1 so we know the load graphs button has been pressed
	LoadGraphPressed = 1;

	//If a table has been loaded before, then clear the table:
	if (LoadTablePressed === 1) {
		//Clear the table pressed variable, and clear/fade out the table now
		LoadTablePressed = 0;
                clearTimeout(UpdateTable);
		$("#table-div").fadeOut(500, function() {
			$("#table-div").empty();
		});
	}

	//load the graphs using an AJAX call to the server side php script
	$.ajax({
		url: 'php/GraphQuery.php',
		dataType: 'json',
		success: function(dataresult) {

			//set the variables needed for the graphs by using elements of the returned query
			Date1 = dataresult[0];
			Date2 = dataresult[1];
			var Datetime = dataresult[2];
			var SOC = dataresult[3];
			var PACK_V = dataresult[4];
			var Capacity = dataresult[5];
			var Current = dataresult[6];
			var Temp = dataresult[7];
			var Contact = dataresult[8];

			var trace1 = {
				x: Datetime,
				y: SOC,
				line: {
					color: "rgba(31,119,180,1)"
				},
				mode: "lines",
				name: "Charge Status",
				type: "scatter",
				xaxis: "x",
				yaxis: "y",
			};

			var trace2 = {
				x: Datetime,
				y: PACK_V,
				line: {
					color: "rgba(255,127,14,1)"
				},
				mode: "lines",
				name: "Pack Voltage",
				type: "scatter",
				xaxis: "x2",
				yaxis: "y2",
			};

			var trace3 = {
				x: Datetime,
				y: Capacity,
				line: {
					color: "rgba(44,160,44,1)"
				},
				mode: "lines",
				name: "Capacity",
				type: "scatter",
				xaxis: "x3",
				yaxis: "y3",
			};

			var trace4 = {
				x: Datetime,
				y: Current,
				line: {
					color: "rgba(214,39,40,1)"
				},
				mode: "lines",
				name: "Current",
				type: "scatter",
				xaxis: "x4",
				yaxis: "y4",
			};

			var trace5 = {
				x: Datetime,
				y: Temp,
				line: {
					color: "rgba(148,103,189,1)"
				},
				mode: "lines",
				name: "Temperature",
				type: "scatter",
				xaxis: "x5",
				yaxis: "y5",
			};

			var trace6 = {
				x: Datetime,
				y: Contact,
				line: {
					color: "rgba(140,86,75,1)"
				},
				mode: "lines",
				name: "Contact Status",
				type: "scatter",
				xaxis: "x6",
				yaxis: "y6",
			};

			//Note each "trace" is a graph
			var data = [trace1, trace2, trace3, trace4, trace5, trace6];

			//This is just settings for layouts of the various graphs
			var layout = {
				margin: {
					r: 10,
					t: 25,
					b: 40,
					l: 60
				},
				showlegend: false,
				title: "",
				titlefont: {
					color: "rgba(0,0,0,1)",
					family: "",
					size: 17.5342465753
				},

				xaxis: {
					anchor: "y",
					domain: [0, 0.23]
				},

				xaxis2: {
					anchor: "y2",
					domain: [0.38, 0.61]
				},

				xaxis3: {
					anchor: "y3",
					domain: [0.76, 1]
				},

				xaxis4: {
					anchor: "y4",
					domain: [0, 0.23]
				},

				xaxis5: {
					anchor: "y5",
					domain: [0.38, 0.61]
				},

				xaxis6: {
					anchor: "y6",
					domain: [0.76, 1]
				},

				yaxis: {
					anchor: "x",
					domain: [0.6, 1]
				},

				yaxis2: {
					anchor: "x2",
					domain: [0.6, 1]
				},

				yaxis3: {
					anchor: "x3",
					domain: [0.6, 1]
				},

				yaxis4: {
					anchor: "x4",
					domain: [0, 0.4]
				},

				yaxis5: {
					anchor: "x5",
					domain: [0, 0.4]
				},

				yaxis6: {
					anchor: "x6",
					domain: [0, 0.4]
				}
			};

			//Start fading in the plotly charts
			$("#plotly-div").fadeIn(1000);
			//Start plotting the charts
			Plotly.plot(gd, data, layout).then(function(gd) {
				window.onresize = function() {
					Plotly.Plots.resize(gd);
				};
			});

			//Declare the function we need to run to update the charts
			ExecuteUpdate = function() {

				//Send an AJAX call to get data for the past twenty seconds
				$.ajax({
					url: 'php/GraphQuery.php',
					dataType: 'json',


					success: function(dataresult) {

						if (LoadTablePressed === 0) {
							//Date1 = dataresult[0];
							//Date2 = dataresult[1];

							//Update the variables we need using elements from the query
							Datetime = dataresult[2];
							SOC = dataresult[3];
							PACK_V = dataresult[4];
							Capacity = dataresult[5];
							Current = dataresult[6];
							Temp = dataresult[7];
							Contact = dataresult[8];


							//Update the graph components
							data[0].x = Datetime;
							data[0].y = SOC;

							data[1].x = Datetime;
							data[1].y = PACK_V;

							data[2].x = Datetime;
							data[2].y = Capacity;

							data[3].x = Datetime;
							data[3].y = Current;

							data[4].x = Datetime;
							data[4].y = Temp;

							data[5].x = Datetime;
							data[5].y = Contact;

							//Re-draw the graph
							Plotly.newPlot(gd, data, layout);
						}
					},

					//Once re-drawing the graph is finished, call the update function again so ensure updating doesn't stop
					complete: function() {
						if (LoadTablePressed === 0) {
							UpdateStartStop = setTimeout(ExecuteUpdate, 1000);
						}
					}


				});
			};

			//Re-activate the "load table" button so user can switch between the graphs currently loaded and the table
			$("#PullTable").prop('disabled', false);

			//Execute the update function in 1000ms (1 second)
			setTimeout(ExecuteUpdate, 1000);


		}
	});
});
