<?php 
    $db = new mysqli('localhost', 'root', '', 'sub');

    if (!isset($_POST['staff_id']) || !isset($_POST['time']) || !isset($_POST['weekday'])) {
        http_response_code(400);
        exit();
    }

    $staffId = mysqli_real_escape_string($db, $_POST['staff_id']);
    $time = mysqli_real_escape_string($db, $_POST['time']);
    $weekday = mysqli_real_escape_string($db, $_POST['weekday']);

    $db->begin_transaction();

    // Find the staff member
    $query1 = "SELECT * FROM staff WHERE `id` = '$staffId'";
    $result = $db->query($query1);
    if (!$result || $result->num_rows === 0) {
        http_response_code(404);
        $db->rollback();
        exit();
    }
    $user = $result->fetch_assoc();

    $lastSubbedValue = $user['last_subbed'] !== null ? "'" . mysqli_real_escape_string($db, $user['last_subbed']) . "'" : "NULL";

    // Insert entry into log
    $query2 = "INSERT INTO log (`date`, `staff_id`, `weekday`, `time`, `previous_last_subbed`) VALUES (NOW(), '$staffId', '$weekday', '$time', $lastSubbedValue)";
    $result2 = $db->query($query2);

    if (!$result2) {
        http_response_code(502);
        $db->rollback();
        exit();
    }

    header('Content-type: application/json');
    echo json_encode(['log_id' => $db->insert_id]);

    // Update the staff members last subbed date
    $query3 = "UPDATE staff SET last_subbed = NOW() WHERE `id` = '$staffId'";
    $result3 = $db->query($query3);

    if (!$result3) {
        http_response_code(502);
        $db->rollback();
        exit();
    }

    $db->commit();
?>