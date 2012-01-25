<?php
//propagate the test table with a lot of random data

$dbconn = pg_Connect("host=capstone06.cs.pdx.edu dbname=fake user=postgres password=bees");
if (!$dbconn) {
    die("Error connecting to database.");
}

$string = file_get_contents("http://capstone06.cs.pdx.edu/data/random.php");
$json = json_decode($string,true);

echo(json_encode($json));

foreach ($json['nodes'] as $node) {
    $source = $node['name'];
    foreach ($node['influence'] as $t) {
	foreach ($t as $target => $inf ) {
	    echo($source . " " . $target . " " . $inf . "<br \>");
	}
    }
}
?>
