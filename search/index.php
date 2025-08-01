<!DOCTYPE html>
<html lang="en">

<?php
$title = "Search Results";
include("../head.php");
?>

<body>

    <h1 class="title">Search Results</h1>

    <div class="extra-options">
        <a class="extra-button" href="<?php echo "/select" ?>"><i class="fa-solid fa-arrow-left"></i>Back</a>
    </div>

    <?php

    // Check to make sure that there actually is a time and a weekday
    if (!isset($_POST['time']) || !isset($_POST['day']) || !$_POST['time']) {
        echo '<div class="info">';
        echo 'Error: Time or day not specified.';
        echo '</div>';
    } else {
        echo '<div class="info">';
        // Convert to readable formats from the data
        $dayInt = (int) $_POST['day'];
        $time12 = convert_24_to_12($_POST['time']);
        echo 'Displaying results for ' . $weekdays[$dayInt] . ' at ' . $time12;
        echo '</div>';
        echo '<div class="info">';
        echo 'Select the first person able to sub for the specified time.';
        echo '</div>';

        echo '<div class="list">';
        echo '<div class="nothings-here">No results found.</div>';

        // Prevent SQL Injection just in case
        $weekday = mysqli_real_escape_string($db, $_POST['day']);
        $time = mysqli_real_escape_string($db, $_POST['time']);

        // Long query to get available staff members for the specified time and weekday
        // Makes sure that the time is more than 10 mins
        $query = "SELECT staff.*, availability.end_time 
              FROM staff 
              JOIN availability ON staff.id = availability.staff_id 
              WHERE availability.weekday = $weekday 
              AND '$time' BETWEEN availability.start_time AND availability.end_time 
              AND TIME_TO_SEC(availability.end_time) - TIME_TO_SEC('$time') > 600 
              ORDER BY staff.last_subbed ASC;";

        // Display the results to the screen
        $result = $db->query($query);
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $name = htmlspecialchars($row['first_name'] . " " . $row['last_name']);
                echo '<div class="list-entry">';
                echo '<div class="list-info">';
                echo '<div class="list-title">' . $name . '</div>';
                echo '<div class="list-desc">Available until ' . convert_24_to_12($row['end_time']) . '</div>';
                echo '</div>';
                // Pass info to the button such that the modal can display the correct info
                echo '<button class="list-action search-action" data-staff-id="' . $row['id'] . '" data-first-name="' . $row['first_name'] . '" data-last-name="' . $row['last_name'] . '" data-weekday="' . $weekdays[$dayInt] . '" data-time="' . $time12 . '" data-weekday-int="' . $dayInt . '" data-time-full="' . $_POST['time'] . '">Select</button>';
                echo '</div>';
            }
        }

        echo '</div>';
    }

    ?>

</body>

</html>