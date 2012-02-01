<?php
//Search for x number of nodes closest to some center node

//the center of our graph
$user = 1;
if (isset($_GET["id"])) {
    $id = $_GET["id"];

    if ( (int)$id == $id && $id >= 0 ) {
        $user = (int)$id;
    }
}

//how many nodes to find around our center
$total = 100;
if (isset($_GET["depth"])) {
    $depth = $_GET["depth"];

    if ( (int)$depth == $depth && $depth >= 0 ) {
        $total = (int)$depth;
    }
}

//how many nodes we've visited so far
$visited[] = $user;
$toVisit = array();

//create the json skeleton
$json['nodes'] = array();
$json['links'] = array();

//connect to the database
$dbconn = pg_Connect("host=capstone06.cs.pdx.edu dbname=fake user=postgres password=bees");
if (!$dbconn) {
    die("Error connecting to database.");
}

//add the central user
addNode($user);
addLinks($user);

//get the links
while (count($visited) < $total && count($toVisit) > 0) {
    foreach ($toVisit as $i => $next) {
        if (in_array($next, $visited)) {
            continue;
        }

        addNode($next);
        addLinks($next);
        $visited[] = $next;
        unset($toVisit[$i]);

        if ( count($visited) >= $total) {
            break;
        }
    }
}

foreach ($toVisit as $next) {
    //TODO: some sort of cleanup
    //maybe addNode but no addLinks
    //or maybe clear links to these nodes
}

echo(json_encode($json));

//close the database connection
pg_close($dbconn);

//here be dragons^Wfunctions
function addNode($who) {
    global $dbconn, $toVisit, $visited, $json;
    //find this nodes name
    $result = pg_Exec($dbconn, "SELECT username FROM users WHERE user_id = $who;");
    $num = pg_numrows($result);
    for ($i = 0; $i < $num; $i++) {
        $row = pg_fetch_array($result, $i);
        $node['name'] = $row[0];
        $node['id'] = $who;
        //add this node to the json
        $json['nodes'][] = $node;
    }
}

function addLinks($who) {
    global $dbconn, $toVisit, $visited, $json;
    //find our immediate links
    $result = pg_Exec($dbconn, "SELECT user_id2, inf_1to2, inf_2to1 FROM relationship WHERE user_id1 = $who;");
    $num = pg_numrows($result);
    for ($i = 0; $i < $num; $i++) {
        $row = pg_fetch_array($result, $i);
        $toVisit[] = $row[0];
        //build the links
        if ($row[1] > 0) {
            $link['source'] = $who;
            $link['target'] = $row[0];
            $link['influence'] = $row[1];
            $json['links'][] = $link;
        }
        if ($row[2] > 0) {
            $link['source'] = $row[0];
            $link['target'] = $who;
            $link['influence'] = $row[2];
            $json['links'][] = $link;
        }
        //TODO: reindex source/target to the nodes array
    }

    //find our immediate links
    $result = pg_Exec($dbconn, "SELECT user_id1, inf_1to2, inf_2to1 FROM relationship WHERE user_id2 = $who;");
    $num = pg_numrows($result);
    for ($i = 0; $i < $num; $i++) {
        $row = pg_fetch_array($result, $i);
        $toVisit[] = $row[0];
        //build the links
        if ($row[1] > 0) {
            $link['source'] = $who;
            $link['target'] = $row[0];
            $link['influence'] = $row[1];
            $json['links'][] = $link;
        }
        if ($row[2] > 0) {
            $link['source'] = $row[0];
            $link['target'] = $who;
            $link['influence'] = $row[2];
            $json['links'][] = $link;
        }
        //TODO: reindex source/target to the nodes array
    }

}

?>
