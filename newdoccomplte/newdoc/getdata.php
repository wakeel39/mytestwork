<?php
error_reporting(0);
header('Access-Control-Allow-Origin: *');
include("docclass.php");
$DocClass = new DocClass();
$method = $_POST['method'];
$url = $_POST['url'];

unset($_POST['url']);
unset($_POST['method']);

$reponseSuccess = $DocClass->PostData($url,$method,$_POST);
$res = json_decode($reponseSuccess);
echo json_encode($res, JSON_PRETTY_PRINT);
?>