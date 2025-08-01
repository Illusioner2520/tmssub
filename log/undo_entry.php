<?php 
    $db = new mysqli('localhost', 'root', '', 'sub');

    if (!isset($_POST['log_id'])) {
        http_response_code(400);
        exit();
    }

    $log_id = mysqli_real_escape_string($db, $_POST['log_id']);

    $db->begin_transaction();

    // Find the log entry
    $query = "SELECT * FROM log WHERE id = '$log_id'";
    $result = $db->query($query);
    if (!$result || $result->num_rows === 0) {
        http_response_code(404);
        $db->rollback();
        exit();
    }
    $log_entry = $result->fetch_assoc();

    $staff_id = mysqli_real_escape_string($db, $log_entry['staff_id']);
    $previous_last_subbed = mysqli_real_escape_string($db, $log_entry['previous_last_subbed']);

    // Change the staff member's last subbed date
    $query2 = "UPDATE staff SET last_subbed = '$previous_last_subbed' WHERE id = '$staff_id'";
    $result2 = $db->query($query2);

    if (!$result2) {
        http_response_code(502);
        $db->rollback();
        exit();
    }

    // Delete the log entry
    $query3 = "DELETE FROM log WHERE id = '$log_id'";
    $result3 = $db->query($query3);

    if (!$result3) {
        http_response_code(502);
        $db->rollback();
        exit();
    }

    $db->commit();
?>