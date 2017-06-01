<?php
        // define variables and set to empty values
        $initErr=$finalErr=$initial=$final=$start=$end="";
        if($_SERVER["REQUEST_METHOD"]=="POST"){
                if(empty($_POST["initial"])){
                        $initErr="Initial Date is required";
                }
                else{
                        $initial=$_POST["initial"];
                }
                if(empty($_POST["final"])){
                        $finalErr="Final Date is required";
                }
                else{
                        $final=$_POST["final"];
                }
        }
        $start=date('Y-m-d H:i:s',strtotime($initial));
        $end=date('Y-m-d H:i:s',strtotime($final));
        /* Connect to mySQL server */
        $link=mysqli_connect("localhost","batuser","password","battery_diag");
        if($link->connect_error){
                echo "Error: Unable to connect to MySQL.".PHP_EOL;
                echo "Debugging errno: ".mysqli_connect_errno().PHP_EOL;
                echo "Debugging error: ".mysqli_connect_error().PHP_EOL;
                exit ;
        }
        /* Select queries return a resultset */
        $result=$link->query("SELECT * FROM prototype_1b WHERE datetime BETWEEN '".$start."' AND '".$end."' ORDER BY datetime DESC");
        if(!$result)die('Couldn\'t fetch records');
        $num_fields=mysqli_num_fields($result);
        $headers=array();
        while($fieldinfo=mysqli_fetch_field($result)){
                $headers[]=$fieldinfo->name;
        }
        $fp=fopen('php://output','w');
        if($fp && $result){
                header('Content-Type: text/csv');
                header('Content-Disposition: attachment; filename="data.csv"');
                header('Pragma: no-cache');
                header('Expires: 0');
                fputcsv($fp,$headers);
                while($row=$result->fetch_row()){
                        fputcsv($fp,$row);
                }
                die ;
        }
        /* Free up memory and close link */
        mysqli_free_result($result);
        mysqli_close($link);
?>
