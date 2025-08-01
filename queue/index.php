<!DOCTYPE html>
<html lang="en">

<?php
    $title = "Queue";
    include("../head.php");
?>

<body>

    <h1 class="title">Queue</h1>

    <div class="extra-options">
        <a class="extra-button" href="<?php echo $_GET['from'] ?? "/" ?>"><i class="fa-solid fa-arrow-left"></i>Back</a>
    </div>

    <div class="info">
        Those further up on the queue are more likely to be chosen to sub.
    </div>

    <div class="list">
        <?php
            $query = "SELECT * FROM staff ORDER BY last_subbed ASC";
            $result = $db->query($query);
            $place = 1;
            if ($result && $result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $name = htmlspecialchars($row['first_name'] . " " . $row['last_name']);
                    $lastSubbedTimestamp = strtotime($row['last_subbed']);
                    $cutoffTimestamp = strtotime('2025-08-10');
                    $lastSubbed = $lastSubbedTimestamp < $cutoffTimestamp ? "Never Chosen to Sub" : "Last Chosen to Sub on " . htmlspecialchars(date("F j", $lastSubbedTimestamp));
                    echo '<div class="list-entry">';
                    echo '<div class="list-place">' . $place . '</div>';
                    echo '<div class="list-info">';
                    echo '<div class="list-title">' . $name . '</div>';
                    echo '<div class="list-desc">' . $lastSubbed . '</div>';
                    echo '</div></div>';
                    $place++;
                }
            }
        ?>
    </div>

</body>

</html>