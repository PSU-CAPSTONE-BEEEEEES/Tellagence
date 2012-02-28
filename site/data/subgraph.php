<?php

//connect to the database
$dbconn = pg_Connect("host=capstone06.cs.pdx.edu dbname=real user=postgres password=bees");
if (!$dbconn) {
    die("Error connecting to database.");
}

//there is no subgraph_id 0
echo('{"subgraphs":[0,');

$result = pg_exec($dbconn, "SELECT COUNT(subgraph_id) FROM subgraphs;");
$rows = pg_fetch_array($result, 0);
$num = $rows[0];

for ($i = 1; $i < $num; $i++) {
    $result = pg_exec($dbconn, "SELECT num FROM subgraphs WHERE subgraph_id = $i;");
    $count = pg_numrows($result);
    if ($count <= 0) {
	die("Bad query at $i");
    }
    $array = pg_fetch_array($result, 0);
    if ($i > 1) {
	echo(', ');
    }
    echo($array[0]);
}

echo('] }');

pg_close($dbconn);
