<?php
//propagate the test table with a lot of random data

$dbconn = pg_Connect("host=capstone06.cs.pdx.edu dbname=fake user=postgres password=bees")
if (!$dbconn) {
    die("Error connecting to database.");
}

$string = file_get_contents("/data/random.php?size=5");
$json = json_decode($string);

echo($json);
?>
