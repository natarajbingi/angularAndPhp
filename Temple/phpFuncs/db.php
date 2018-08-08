<?php

########## MySql details (Replace with yours) #############
$username = "root"; //mysql username
$password = ""; //mysql password
$hostname = "localhost"; //hostname
$databasename = 'shastri_temple'; //databasename

//connect to database
$conn = mysqli_connect($hostname, $username, $password) or die('could not connect to database');
mysqli_select_db($conn, $databasename);

/*if($conn){
    echo 'echo';
}*/
?>