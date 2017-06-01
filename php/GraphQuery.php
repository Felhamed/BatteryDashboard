<?php
/* Connect to stromcore.tk and port 3306 */
$link = mysql_connect('localhost:3306', 'batuser', 'password');
if (!$link) {
    die('Could not connect: ' . mysql_error());
}

/* Select the right database */
$db_selected = mysql_select_db('battery_diag', $link);
if (!$db_selected) {
    die ('Can\'t use battery_diag : ' . mysql_error());
}

/* Send the query */
$QueryText = "SELECT datetime, soc, pack_voltage, capacity, current, temperature, contact_status from prototype_1 where datetime > (DATE_SUB(NOW(), INTERVAL 20 SECOND)) ORDER BY datetime ASC";
$sql = mysql_query($QueryText) or die(mysql_error());
$numRows = (mysql_num_rows($sql)-1);

/* Get the first date of data */
mysql_data_seek($sql, 0);
$date1 = mysql_fetch_assoc($sql);
$date1 = $date1['datetime'];

/* Get the last date of data */
mysql_data_seek($sql, $numRows);
$date2 = mysql_fetch_assoc($sql);
$date2 = $date2['datetime'];


/* Declare arrays for each column */
$DateTime=array();
$SOC=array();
$PACK_V=array();
$Capacity=array();
$Current=array();
$Temp=array();
$Contact_Status=array();


/* Push each column value in each row to its respective array */
mysql_data_seek($sql, 0);
while ($row = mysql_fetch_assoc($sql)){
array_push($GLOBALS['DateTime'], $row['datetime']);

array_push($GLOBALS['SOC'], $row['soc']);

array_push($GLOBALS['PACK_V'], $row['pack_voltage']);

array_push($GLOBALS['Capacity'], $row['capacity']);

array_push($GLOBALS['Current'], $row['current']);

array_push($GLOBALS['Temp'], $row['temperature']);

array_push($GLOBALS['Contact_Status'], $row['contact_status']);
}


/* Merge all columns and encode as JSON data */
$TableData = array ($date1, $date2, $GLOBALS['DateTime'], $GLOBALS['SOC'], $GLOBALS['PACK_V'], $GLOBALS['Capacity'], $GLOBALS['Current'], $GLOBALS['Temp'], $GLOBALS['Contact_Status']);

$TableData = json_encode($TableData);


mysql_free_result($sql);
mysql_close($link);
echo $TableData;


?>
