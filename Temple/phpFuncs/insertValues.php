<?php

/**
 * Created by PhpStorm.
 * User: Nataraj
 * Date: 28-07-2018
 * Time: 01:18 AM
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
if ($Type == "sevaMember") {

    $queryMem = "INSERT INTO `members_table`( `firstname`, `midname`, `lastname`, `address`, `rashi`, `nakshatra`, `thithi`, `gothra`, `entered_date`, `town_village`, `taluk`, `district`, `state`, `phone`, `mobile`, `email`,  `permanent`,  `entered_by`,`deleted`, `created_datetime`)" .
        " VALUES ('$data->firstname','$data->midname','$data->lastname','$data->address','$data->rashi','$data->nakshatra','$data->thithi','$data->gothra','$data->entered_date','$data->town_village','$data->taluk','$data->district','$data->state','$data->phone','$data->mobile','$data->email','$data->permanent','$data->entered_by','0',NOW())";

    $resultMem = mysqli_query($conn, $queryMem);
    mysqli_close($conn);
    if ($resultMem) {
//        array_push($response["data"], "EM");
        $response["message"] = "Member Added successfully";

    } else {
        $response["success"] = 0;
//        array_push($response["data"], "");
        $response["message"] = "Error while adding Member.";
    }

    echo json_encode($response);
} else if ($Type == "sevaName") {

    $querySev = "INSERT INTO `sevas_table`( `seva_name`, `seva_amount`, `discount`, `entered_by`,`deleted`, `created_datetime`)" .
        " VALUES ('$data->seva_name','$data->seva_amount','$data->discount_Seva','$data->entered_by','0',NOW())";

    $resultSev = mysqli_query($conn, $querySev);
    mysqli_close($conn);
    if ($resultSev) {
        // array_push($response["data"], "");
        $response["message"] = "Seva Added successfully";

    } else {
        $response["success"] = 0;
        //array_push($response["data"], "");
        $response["message"] = "Error while adding Seva.";
    }
    echo json_encode($response);

} else if ($Type == "newEmployee") {

    $querySev = "INSERT INTO `access_login`( `fname`, `lname`, `gender`, `empid`, `pwd`, `category`, `address`, `phno`,  `doj`) ".
        " VALUES ('$data->fname','$data->lname','$data->gender' ,'$data->empid','$data->pwd','$data->category' ,'$data->address','$data->phno','$data->doj')";

    $resultSev = mysqli_query($conn, $querySev);
    mysqli_close($conn);
    if ($resultSev) {
        // array_push($response["data"], "");
        $response["message"] = "Employee Added successfully";

    } else {
        $response["success"] = 0;
        //array_push($response["data"], "");
        $response["message"] = "Error while adding Employee.";
    }
    echo json_encode($response);

} else if ($Type == "sevaNewInvoice") {
    $id = $data->memberName->id;
    $memberName = $data->memberName->firstname . " " . $data->memberName->lastname;
    $gothra = $data->memberName->gothra;
    $nakshatra = $data->memberName->nakshatra;
    $mobile = $data->memberName->mobile;
    $address = $data->memberName->address . " " . $data->memberName->town_village . " " . $data->memberName->taluk . " " . $data->memberName->district . " " . $data->memberName->state;
    $querySevInvoice = "INSERT INTO `seva_biiling_table`(  `entered_date_invoice_`, `memberId`, `memberName`, `address`, `gothra`, `nakshatra`, `mobile`, `entered_by`, `BillingSeavsIDs`, `BillingSeavsIDAmt`, `deleted`, `created_datetime`)" .
        " VALUES ( '$data->entered_date_invoice','$id', '$memberName','$address','$gothra', '$nakshatra','$mobile','$data->entered_by','$data->BillingSeavsIDs','$data->BillingSeavsIDAmt','0',NOW())";

    $response["data"] = array();
    $response["last_id"] = "";
    $resultSevInvoice = mysqli_query($conn, $querySevInvoice);
    $last_id = mysqli_insert_id($conn);
    mysqli_close($conn);
    if ($resultSevInvoice) {
        array_push($response["data"], $data);
        $response["last_id"] = $last_id;
        $response["message"] = "Bill Added successfully";

    } else {
        $response["success"] = 0;
        //array_push($response["data"], "");
        $response["message"] = "Error while adding Bill.";
    }
//    print_r($data);
    echo json_encode($response);

} else if ($Type == "sevaEditMember") {
    $midname = $data->midname;
    $querySevMem = "UPDATE `members_table` SET `firstname`='$data->firstname', `midname`='$midname', `lastname`='$data->lastname' , `address`='$data->address' , `rashi`='$data->rashi',  `nakshatra`='$data->nakshatra', `thithi`='$data->thithi', `gothra`='$data->gothra', `town_village`='$data->town_village', `taluk`='$data->taluk', `district`='$data->district', `state`='$data->state', `phone`='$data->phone',  `mobile`='$data->mobile', `email`='$data->email',`permanent`='$data->permanent', `entered_by`='$data->entered_by'  WHERE  `id`='$data->id'";
    $resultSevMem = mysqli_query($conn, $querySevMem);

    if ($resultSevMem) {
        $response["data"] = array();
        $response["success"] = 1;
        $result = mysqli_query($conn, "SELECT * FROM `members_table` where `deleted`='0'");
        mysqli_close($conn);
        if ($result != false)
            $NumOfUsers = mysqli_num_rows($result);
        else
            $NumOfUsers = 0;
        //print_r($result);
        if ($NumOfUsers > 0) {
            while ($row = $result->fetch_assoc()) {
                array_push($response["data"], $row);// push all row lists in to array
            }
        }
        // array_push($response["data"], "");
        $response["message"] = "Seva Updated successfully";

    } else {
        $response["success"] = 0;
        //array_push($response["data"], "");
        $response["message"] = "Error while Updating Seva.";
    }
    echo json_encode($response);

} else if ($Type == "sevaEditName") {

    $querySev = "UPDATE `sevas_table` SET  `seva_name`='$data->seva_name',`seva_amount`='$data->seva_amount',`discount` ='$data->discount' WHERE `id`='$data->id'";
    $resultSev = mysqli_query($conn, $querySev);

    if ($resultSev) {
        $response["data"] = array();
        $response["success"] = 1;
        $result = mysqli_query($conn, "SELECT * FROM `sevas_table` where `deleted`='0'");
        mysqli_close($conn);
        if ($result != false)
            $NumOfUsers = mysqli_num_rows($result);
        else
            $NumOfUsers = 0;
        //print_r($result);
        if ($NumOfUsers > 0) {
            while ($row = $result->fetch_assoc()) {
                array_push($response["data"], $row);// push all row lists in to array
            }
        }
        // array_push($response["data"], "");
        $response["message"] = "Seva Updated successfully";

    } else {
        $response["success"] = 0;
        //array_push($response["data"], "");
        $response["message"] = "Error while Updating Seva.";
    }
    echo json_encode($response);

} else if ($Type == "sevaDeleteMember") {

    $querySev = "UPDATE `members_table` SET `deleted`='1'  WHERE `id`='$data->id'";
    $resultSev = mysqli_query($conn, $querySev);

    if ($resultSev) {
        $response["data"] = array();
        $response["success"] = 1;
        $result = mysqli_query($conn, "SELECT * FROM `members_table` where `deleted`='0'");
        mysqli_close($conn);
        if ($result != false)
            $NumOfUsers = mysqli_num_rows($result);
        else
            $NumOfUsers = 0;
        //print_r($result);
        if ($NumOfUsers > 0) {
            while ($row = $result->fetch_assoc()) {
                array_push($response["data"], $row);// push all row lists in to array
            }
        }
        // array_push($response["data"], "");
        $response["message"] = "Member Deleted successfully";

    } else {
        $response["success"] = 0;
        //array_push($response["data"], "");
        $response["message"] = "Error while Deleting Member.";
    }
    echo json_encode($response);

} else if ($Type == "sevaDeleteName") {

    $querySev = "UPDATE `sevas_table` SET `deleted`='1'  WHERE `id`='$data->id'";
    $resultSev = mysqli_query($conn, $querySev);

    if ($resultSev) {
        $response["data"] = array();
        $response["success"] = 1;
        $result = mysqli_query($conn, "SELECT * FROM `sevas_table` where `deleted`='0'");
        mysqli_close($conn);
        if ($result != false)
            $NumOfUsers = mysqli_num_rows($result);
        else
            $NumOfUsers = 0;
        //print_r($result);
        if ($NumOfUsers > 0) {
            while ($row = $result->fetch_assoc()) {
                array_push($response["data"], $row);// push all row lists in to array
            }
        }
        // array_push($response["data"], "");
        $response["message"] = "Seva Deleted successfully";

    } else {
        $response["success"] = 0;
        //array_push($response["data"], "");
        $response["message"] = "Error while Deleting Seva.";
    }
    echo json_encode($response);

} else {
    $response["success"] = 0;
    $response["message"] = "Invalid Request";
    echo json_encode($response);
}

