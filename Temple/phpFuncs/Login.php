<?php
//Start session
ob_start();
session_start();

include("db.php");
$uname = $_POST["uname"];
$pword = $_POST["psw"];
$passEncrypt = $pword;//md5($pword);
$response = array();
// success
$response["success"] = 1;
$result = mysqli_query($conn, "SELECT * FROM access_login WHERE empid = '$uname'");
mysqli_close($conn);
if ($result) {
    $rows = mysqli_fetch_array($result);
    $response["data"] = array();
    $email1 = $rows['empid'];
    $pass1 = $rows['pwd'];
//    $type1 = $rows['type'];

    if ($uname != $email1 || $uname == "") {
        $response["success"] = 0;
        $response["message"] = "invalidUser";
        // echo no users JSON
        echo json_encode($response);
        //  echo "invalidUser";
    } else if ($passEncrypt != $pass1 || $passEncrypt == "") {
        //  echo "invalidPass";
        $response["success"] = 0;
        $response["message"] = "invalidPass";
        // echo no users JSON
        echo json_encode($response);
    } elseif ($uname != "" && $passEncrypt != "") {
        if ($uname == $email1 && $passEncrypt == $pass1) {

            $response["success"] = 1;
            $response["message"] = "logged in successfully";

            $data = array();
            $data["name"] = $rows["fname"] . ' ' . $rows["lname"];
            $data["empid"] = $rows["empid"];
            $data["gender"] = $rows["gender"];
            $data["category"] = $rows["category"];
            $data["phno"] = $rows["phno"];

            array_push($response["data"], $data);
        }
        //  echo "valid";
        echo json_encode($response);
    }
} else {
    print_r($result . 'ERROR Buddy');
}

?>