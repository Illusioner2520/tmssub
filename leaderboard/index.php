<!DOCTYPE html>
<html lang="en">

<?php
    $title = "Leaderboard";
    include("../head.php");
?>

<body>

    <h1 class="title">Leaderboard</h1>

    <div class="extra-options">
        <a class="extra-button" href="/select"><i class="fa-solid fa-arrow-left"></i>Back</a>
    </div>

    <div class="list">
        <div class="nothings-here">No staff members have been added yet.</div>
        <?php
            $query = "SELECT staff.id AS staff_id, COUNT(log.staff_id) AS count, staff.first_name, staff.last_name FROM staff LEFT JOIN log ON staff.id = log.staff_id GROUP BY staff.id, staff.first_name, staff.last_name;";
            $result = $db->query($query);
            $place = 1;
            if ($result && $result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $name = htmlspecialchars($row['first_name'] . " " . $row['last_name']);
                    echo '<div class="list-entry">';
                    echo '<div class="list-place">' . $place . '</div>';
                    echo '<div class="list-info">';
                    echo '<div class="list-title">' . $name . '</div>';
                    echo '<div class="list-desc">Subbed ' . $row['count'] . ' time' . ($row['count'] == 1 ? '' : 's') . ' this year</div>';
                    echo '</div></div>';
                    $place++;
                }
            }
        ?>
    </div>

</body>

</html>