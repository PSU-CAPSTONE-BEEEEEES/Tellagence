<?php

//connect to the database
$dbconn = pg_Connect("host=capstone06.cs.pdx.edu dbname=real user=postgres password=bees");
if (!$dbconn) {
    die("Error connecting to database.");
}


$result = pg_exec($dbconn, "SELECT COUNT(subgraph_id) FROM subgraphs;");
$rows = pg_fetch_array($result, 0);
$num = $rows[0];

for ($i = 1; $i < $num; $i++) {
    $result = pg_exec($dbconn, "SELECT user_ids FROM subgraphs WHERE subgraph_id = $i;");
    $array = pg_fetch_array($result, 0);
    $users = explode(":",$array[0]);

    $tmp = implode(",", $users);
    pg_exec($dbconn, "UPDATE users SET subgraph='$i' WHERE user_id IN (" . $tmp . ");");
}

pg_close($dbconn);
