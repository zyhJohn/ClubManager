<?php
$servername = "127.0.0.1:3306";
$username = $_GET['name'];//$_GET['']内是小程序发送的参数
$password = $_GET['password'];
$database = $_GET['database'];
$openid = $_GET['openid'];
$code = $_GET['code'];

$conn = new mysqli($servername, $username, $password,$database);

if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
    
} 

$sql = "INSERT INTO user (openid) VALUES ('".$openid."')";

if ($conn->query($sql) === TRUE) {
    echo "succeed";
} else {
    echo "Error creating database: " . $conn->error;
    
}

$conn->close();
?>