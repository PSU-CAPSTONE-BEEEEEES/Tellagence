<?php
//propagate the test table with a lot of random data

$dbconn = pg_Connect("host=capstone06.cs.pdx.edu dbname=fake user=postgres password=bees");
if (!$dbconn) {
    die("Error connecting to database.");
}

$result = pg_Exec($dbconn, "SELECT * FROM users WHERE user_id = 200;");
$num = pg_numrows($result);
for ($i = 0; $i < $num; $i++) {
    echo(pg_fetch_array($result, $i) . "<br />");
}

$result = pg_Exec($dbconn, "SELECT * FROM relationship WHERE user_id1 = 200;");
$num = pg_numrows($result);
for ($i = 0; $i < $num; $i++) {
    echo(pg_fetch_array($result, $i) . "<br />");
}

pg_close($dbconn);

?>
