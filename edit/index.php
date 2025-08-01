<!DOCTYPE html>
<html lang="en">

<?php
$title = "Edit";
include("../head.php");
?>

<body>

    <h1 class="title">Edit</h1>

    <div class="extra-options">
        <a class="extra-button" href="/select"><i class="fa-solid fa-arrow-left"></i>Back</a>
    </div>

    <?php
        if (isset($_GET['message'])) {
            echo '<div class="success">' . $_GET['message'] . '</div>';
        }
    ?>

    <div class="list-flex-title">
        <h1>Staff</h1>
        <button class="list-add" id="staff-add"><i class="fa-solid fa-plus"></i></button>
    </div>

    <div class="list">
        <div class="nothings-here">No staff members have been added yet.</div>
        <?php
        // Get availability
        $sql = "SELECT staff_id, weekday, start_time, end_time FROM availability";
        $result1 = $db->query($sql);
        $staffAvailability = [];

        while ($row = $result1->fetch_assoc()) {
            $staffId = $row["staff_id"];
            if (!isset($staffAvailability[$staffId])) {
                $staffAvailability[$staffId] = [];
            }
            $staffAvailability[$staffId][] = [
                "weekday" => (int) $row["weekday"],
                "start" => $row["start_time"],
                "end" => $row["end_time"]
            ];
        }

        $query = "SELECT staff.* FROM staff ORDER BY last_name";
        $result = $db->query($query);
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $name = htmlspecialchars($row['first_name'] . " " . $row['last_name']);
                echo '<div class="list-entry">';
                echo '<div class="list-info">';
                echo '<div class="list-title">' . $name . '</div>';
                echo '</div>';
                echo '<button class="list-action edit-action" data-availability=\'' . json_encode($staffAvailability[$row['id']] ?? []) . '\' data-staff-id="' . $row['id'] . '" data-first-name="' . $row['first_name'] . '" data-last-name="' . $row['last_name'] . '">Edit</button>';
                echo '<button style="margin-left:0;align-self:stretch;border-radius:8px;padding-inline:19px;" class="list-action trash delete-action" data-staff-id=' . $row['id'] . ' data-first-name="' . $row['first_name'] . '" data-last-name="' . $row['last_name'] . '"><i class="fa-solid fa-trash-can"></i></button>';
                echo '</div>';
            }
        }
        ?>
    </div>

</body>

</html>