<!DOCTYPE html>
<html lang="en">
    
<?php include("../head.php") ?>

<body>

    <h1 class="title">Thornton Middle School Sub System</h1>

    <?php
        if (isset($_GET['log_id'])) {
            echo '<div class="success">' . $_GET['message'] . '<button class="undo" data-log-id="' . $_GET['log_id'] . '" data-first-name="' . $_GET['first'] . '" data-last-name="' . $_GET['last'] . '">Undo</button></div>';
        } else if (isset($_GET['message'])) {
            echo '<div class="success">' . $_GET['message'] . '</div>';
        }
    ?>

    <form class="go-options" method="post" action="/search/index.php">
        <input name="time" id="time" type="time" class="time-input">
        <select name="day" id="day" class="day-input">
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thursday</option>
            <option value="5">Friday</option>
        </select>
        <button type="submit" class="go-button" id="go-button">Search</button>
    </form>

    <div class="extra-options">
        <a class="extra-button" href="/edit"><i class="fa-solid fa-pencil"></i>Edit</a>
        <a class="extra-button" href="/queue?from=/select"><i class="fa-solid fa-users"></i>Queue</a>
        <a class="extra-button" href="/log"><i class="fa-solid fa-file-lines"></i>Log</a>
    </div>

</body>

</html>