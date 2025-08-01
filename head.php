<?php
    // Access the database here such that we only have to define it once
    $db = new mysqli('localhost', 'root', '', 'sub');

    // List of weekdays for easy conversion from number to text
    $weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Converts 19:00 to 7:00 PM (because we store it as 24hrs, but want to display it in 12hrs)
    function convert_24_to_12($time_str) {
        $timeObj = DateTime::createFromFormat('H:i', $time_str);
        if (!$timeObj) $timeObj = DateTime::createFromFormat('H:i:s', $time_str);
        return $timeObj ? $timeObj->format('g:i A') : $time_str;
    }

    // Easily format a date from Y-m-d H:i:s to M j, Y g:i A
    function formatDate($date_str) {
        $date = DateTime::createFromFormat('Y-m-d H:i:s', $date_str);
        if (!$date) {
            $date = DateTime::createFromFormat('Y-m-d', $date_str);
        }
        if ($date) {
            return $date->format('M j, Y g:i A');
        }
        return $date_str;
    }
?>

<head>
    <meta charset="UTF-8">
    <meta name="color-scheme" content="dark">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <?php
            // When including the head.php file on other pages, specifying the $title variable makes it the title
            if (isset($title)) {
                echo $title . " | Thornton Middle School Sub System";
            } else {
                echo "Thornton Middle School Sub System";
            }
        ?>
    </title>
    <link rel="stylesheet" href="/style.css">
    <script src="/script.js" defer></script>
    <script src="https://kit.fontawesome.com/833cdaff8a.js" crossorigin="anonymous"></script>
</head>