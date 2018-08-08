<?php
//Start session
session_start();
//Check whether the session variable SESS_MEMBER_ID is present or not
if (!isset($_SESSION['empid'])) {
    header("location: ../logindex.php");
    exit();
}
session_destroy();
unset($_SESSION['empid']);

header('Location: ../logindex.php');
?>