<?php
session_start();

$db = new mysqli('localhost', 'root', '', 'sub');

// Check for staff id
if (!isset($_POST['staff_id'])) {
    http_response_code(400);
    echo "Required Info Not Provided";
    exit();
}

// Check for auth
if (!isset($_SESSION['authorized'])) {
    http_response_code(403);
    echo "Not Authorized";
    exit();
}

$staff_id = mysqli_real_escape_string($db, $_POST['staff_id']);

$db->begin_transaction();


try {
    // Delete staff entry
    $query1 = "DELETE FROM staff WHERE id = '$staff_id'";
    $result1 = $db->query($query1);

    if (!$result1) {
        http_response_code(502);
        echo "Unable to Delete Staff Entry";
        exit();
    }

    // Delete availability entries
    $query2 = "DELETE FROM availability WHERE staff_id = '$staff_id'";
    $result2 = $db->query($query2);

    if (!$result2) {
        http_response_code(502);
        echo "Unable to Delete Availability Data";
        exit();
    }
    $db->commit();
} catch (Exception $e) {
    $db->rollback();
    http_response_code(500);
    echo "Unable to Delete Staff Entry";
}

?>