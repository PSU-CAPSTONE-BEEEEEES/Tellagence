<?php

//connect to the database
$dbconn = pg_Connect("host=capstone06.cs.pdx.edu dbname=real user=postgres password=bees");
if (!$dbconn) {
    die("Error connecting to database.");
}

echo('{"users":[');

$result = pg_exec($dbconn, "SELECT username FROM users;");
$num = pg_numrows($result);

for ($i = 0; $i < $num; $i++) {
    $array = pg_fetch_array($result, $i);
    if ($i > 0) {
        echo(', ');
    }
    echo('{"username": "' . $array[0] . '"}');
}

echo('] }');

pg_close($dbconn);
