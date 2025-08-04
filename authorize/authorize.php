<?php
session_start();

$db = new mysqli('localhost', 'root', '', 'sub');

if (!isset($_POST['password'])) {
    http_response_code(400);
    echo "Required Info Not Provided";
    if (isset($_POST['to'])) header("Location: /authorize?errmessage=Unable to authorize: Required Info Not Provided&to=" . $_POST['to']);
    exit();
}

$query = "SELECT * FROM authorization WHERE id = '1'";
$result = $db->query($query);
$info = $result->fetch_assoc();

if (hash('sha512', $_POST['password'] . $info['salt']) != $info['hash']) {
    http_response_code(403);
    echo "Incorrect Password";
    if (isset($_POST['to'])) header("Location: /authorize?errmessage=Unable to authorize: Incorrect Password&to=" . $_POST['to']);
    exit();
}

$_SESSION['authorized'] = 'true';

if (isset($_POST['to'])) {
    header("Location: " . $_POST['to'] . "?message=Successfully authorized");
}

?>