<?php

if (isset($_GET["user"])) {
    $toMatch = $_GET["user"];
} else {
    die("I feel so alone.");
}

//connect to the database
$dbconn = pg_Connect("host=capstone06.cs.pdx.edu dbname=real user=postgres password=bees");
if (!$dbconn) {
    die("Error connecting to database.");
}


$result = pg_exec($dbconn, "SELECT username FROM users;");
$num = pg_numrows($result);

for ($i = 0; $i < $num; $i++) {
    $array = pg_fetch_array($result, $i);
    if(strpos($array[0], $toMatch)) {
        $names[] = $array[0];
    }
    if(sizeof($names) > 4) {
        break;
    }
}

echo('{"names": ');
echo(json_encode($names));
echo('}');


pg_close($dbconn);
