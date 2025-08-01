<!DOCTYPE html>
<html lang="en">
    
<?php 
    $title = "Log";
    include("../head.php");
?>

<body>

    <h1 class="title">Log</h1>

    <div class="extra-options">
        <a class="extra-button" href="/select"><i class="fa-solid fa-arrow-left"></i>Back</a>
    </div>

    <?php
        if (isset($_GET['message'])) {
            echo '<div class="success">' . $_GET['message'] . '</div>';
        }
    ?>

    <div class="list">
        <div class="nothings-here">No staff members have been selected to sub yet.</div>
        <?php
            $query = "SELECT staff.first_name, staff.last_name, log.* FROM log JOIN staff ON log.staff_id = staff.id ORDER BY date DESC";
            $result = $db->query($query);
            $users_already_processed = array();
            if ($result && $result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $name = htmlspecialchars($row['first_name'] . " " . $row['last_name']);
                    echo '<div class="list-entry">';
                    echo '<div class="list-info">';
                    echo '<div class="list-title">' . $name . '</div>';
                    echo '<div class="list-desc">Selected to sub ' . $weekdays[$row['weekday']] . ' at ' . convert_24_to_12($row['time']) . '<br>Processed ' . formatDate($row['date']) . '</div>';
                    echo '</div>';
                    if (!in_array($row['staff_id'], $users_already_processed)) {
                        echo '<button class="list-action log-action" data-log-id="' . $row['id'] . '" data-first-name="' . $row['first_name'] . '" data-last-name="' . $row['last_name'] . '">Undo</button>';
                    }
                    echo '</div>';
                    array_push($users_already_processed, $row['staff_id']);
                }
            }
        ?>
    </div>
</body>

</html>