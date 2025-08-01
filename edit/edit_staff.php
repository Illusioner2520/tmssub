<?php
$db = new mysqli('localhost', 'root', '', 'sub');

if (!isset($_POST['staff_id']) || !isset($_POST['first_name']) || !isset($_POST['last_name']) || !isset($_POST['availability'])) {
    http_response_code(400);
    exit();
}

$staff_id = mysqli_real_escape_string($db, $_POST['staff_id']);
$first_name = mysqli_real_escape_string($db, $_POST['first_name']);
$last_name = mysqli_real_escape_string($db, $_POST['last_name']);
$availability = json_decode($_POST['availability'], true);

if ($staff_id == 0) {
    $query = "INSERT INTO staff (`first_name`, `last_name`) VALUES ('$first_name', '$last_name')";
    $result = $db->query($query);
    $staff_id = $db->insert_id;
} else {
    $query = "UPDATE staff SET `first_name` = '$first_name', `last_name` = '$last_name' WHERE id = '$staff_id'";
    $result = $db->query($query);
}

$db->begin_transaction();

try {
    $deleteresult = $db->query("DELETE FROM availability WHERE staff_id = '$staff_id'");

    foreach ($availability as $slot) {
        if (!isset($slot["weekday"], $slot["start"], $slot["end"])) {
            throw new Exception("Invalid availability slot");
        }

        $weekday = mysqli_real_escape_string($db, (int) $slot["weekday"]);
        $start = mysqli_real_escape_string($db, $slot["start"]);
        $end = mysqli_real_escape_string($db, $slot["end"]);

        $addresult = $db->query("INSERT INTO availability (`staff_id`, weekday, `start_time`, `end_time`) VALUES ('$staff_id', '$weekday', '$start', '$end')");
    }

    $db->commit();
} catch (Exception $e) {
    $db->rollback();
    http_response_code(500);
}

?>