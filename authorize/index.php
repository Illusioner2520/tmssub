<!DOCTYPE html>
<html lang="en">

<?php
$title = "Authorize";
include("../head.php");
?>

<body>

    <div id="notauthorized" data-to="<?php

    if (isset($_GET['to'])) {
        echo $_GET['to'];
    } else {
        echo "/select";
    }

    ?>"></div>

</body>

</html>