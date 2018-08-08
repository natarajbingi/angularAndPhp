<?php

/**
 * Created by PhpStorm.
 * User: Nataraj
 * Date: 28-07-2018
 * Time: 02:13 AM
 */

ob_start();
session_start();

include("db.php");
$response = array();
// success
$response["success"] = 1;
$data = json_decode(file_get_contents("php://input"));
//print_r($data);
$Type = $data->Type;
if ($Type == "sevaGetMembers") {
    $response["data"] = array();
    $result = mysqli_query($conn, "SELECT * FROM `members_table` where `deleted`='0'");
    mysqli_close($conn);
    if ($result != false)
        $NumOfUsers = mysqli_num_rows($result);
    else
        $NumOfUsers = 0;

    if ($NumOfUsers > 0) {
        $response["success"] = 1;
        while ($row1 = $result->fetch_assoc()) {
            array_push($response["data"], $row1);// push all row lists in to array
        }
        $response["message"] = "All Members record Fetched successfully.";
    }
    echo json_encode($response);
} else if ($Type == "sevaGetNames") {
    $response["data"] = array();
    $result = mysqli_query($conn, "SELECT * FROM `sevas_table` where `deleted`='0'");
    mysqli_close($conn);
    if ($result != false)
        $NumOfUsers = mysqli_num_rows($result);
    else
        $NumOfUsers = 0;
    //print_r($result);
    if ($NumOfUsers > 0) {
        $response["success"] = 1;
        while ($row = $result->fetch_assoc()) {
            array_push($response["data"], $row);// push all row lists in to array
        }

        $response["message"] = "All Sevas Fetched successfully.";
    }
    echo json_encode($response);
} else if ($Type == "sevaGetBills") {
    $response["data"] = array();
    $result = mysqli_query($conn, "SELECT * FROM `seva_biiling_table` where `deleted`='0'");
    mysqli_close($conn);
    if ($result != false)
        $NumOfUsers = mysqli_num_rows($result);
    else
        $NumOfUsers = 0;
    //print_r($result);
    if ($NumOfUsers > 0) {
        $response["success"] = 1;
        while ($row = $result->fetch_assoc()) {
            array_push($response["data"], $row);// push all row lists in to array
        }

        $response["message"] = "All billings Fetched successfully.";
    }
    echo json_encode($response);
} else if ($Type == "accessGetAll") {
    $response["data"] = array();
    $result = mysqli_query($conn, "SELECT * FROM `access_login` ");
    mysqli_close($conn);
    if ($result != false)
        $NumOfUsers = mysqli_num_rows($result);
    else
        $NumOfUsers = 0;
    //print_r($result);
    if ($NumOfUsers > 0) {
        $response["success"] = 1;
        while ($row = $result->fetch_assoc()) {
            array_push($response["data"], $row);// push all row lists in to array
        }

        $response["message"] = "All Employee Fetched successfully.";
    }
    echo json_encode($response);
} else if ($Type == "getGetCounts") {
    $response["data"] = array();
    $resultMember = mysqli_query($conn, "SELECT COUNT(*) as memberCount FROM members_table where `deleted`='0'");
    $resultBiiling = mysqli_query($conn, "SELECT COUNT(*) as biilingCount FROM `seva_biiling_table` where `deleted`='0'");
    $resultSevas = mysqli_query($conn, "SELECT COUNT(*) as sevasCount FROM `sevas_table` where `deleted`='0'");


    $jsonTempData = array();
    mysqli_close($conn);
    while ($rows = mysqli_fetch_array($resultMember)) {
        $jsonTempData['memberCount'] = $rows["memberCount"];
    }
    while ($rows1 = mysqli_fetch_array($resultBiiling)) {
        $jsonTempData['biilingCount'] = $rows1["biilingCount"];
    }
    while ($rows2 = mysqli_fetch_array($resultSevas)) {
        $jsonTempData['sevasCount'] = $rows2["sevasCount"];
    }
    array_push($response["data"], $jsonTempData);

    $response["message"] = "All count Fetched successfully.";
    echo json_encode($response);
} else if ($Type == "sevaGetTest") {

    print_r($data);
} else {
    $response["success"] = 0;
    $response["message"] = "Invalid Request";
    echo json_encode($response);
}