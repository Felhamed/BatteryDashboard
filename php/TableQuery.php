<?php
/* Connect to mySQL server */
$link = mysqli_connect("localhost", "batuser", "password", "battery_diag");

if ($link->connect_error) {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}

/* Select queries return a resultset */
$result = mysqli_query($link, "SELECT datetime, soc, pack_voltage, capacity, current, temperature, contact_status from prototype_1b ORDER BY datetime DESC LIMIT 30") or die(mysqli_error());

/* Generate a table if the query returns some data:  */
if ($result->num_rows > 0) {
   echo "<table class='container'>
   <tr>
   <th>DateTime</th>
   <th>SOC</th>
   <th>PACK_V</th>
   <th>Capacity</th>
   <th>Current</th>
   <th>Temp</th>
   <th>Contact_status</th></tr>";
   while ($row = $result->fetch_assoc()) {
      echo "<tr>";
      echo '<td>'.$row['datetime'].'</td>';
      echo '<td>'.$row['soc'].'</td>';
      echo '<td>'.$row['pack_voltage'].'</td>';
      echo '<td>'.$row['capacity'].'</td>';
      echo '<td>'.$row['current'].'</td>';
      echo '<td>'.$row['temperature'].'</td>';
      echo '<td>'.$row['contact_status'].'</td>';
      echo "</tr>";      
      }
          echo "</table><br>"; 
} else {
   echo "No Results";
   }
   
/* Free up memory and close link */
mysqli_free_result($result);
mysqli_close($link);
?>
