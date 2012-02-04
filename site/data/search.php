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
$user = (string)$user;

//how many nodes to find around our center
$total = 100;
if (isset($_GET["depth"])) {
    $depth = $_GET["depth"];

    if ( (int)$depth == $depth && $depth >= 0 ) {
        $total = (int)$depth;
    }
}

//how many nodes we've visited so far
//also used to map database index <-> json index
$visited[] = $user;

//list of nodes to visit
$toVisit = array();

//query the db for the shortest paths
$path = array();

//create the json skeleton
$json['nodes'] = array();
$json['links'] = array();

//connect to the database
$dbconn = pg_Connect("host=capstone06.cs.pdx.edu dbname=fake user=postgres password=bees");
if (!$dbconn) {
    die("Error connecting to database.");
}

//add the central user
getPath($user);
addNode($user);
addLinks($user);

//get the links
while (count($visited) < $total && count($toVisit) > 0) {
    foreach ($toVisit as $i => $next) {
        if (in_array($next, $visited)) {
            continue;
        }

        getPath($next);
        addNode($next);
        addLinks($next);
        $visited[] = $next;
        unset($toVisit[$i]);

        if ( count($visited) >= $total) {
            break;
        }
    }
}

$count = count($json['nodes']);
foreach ($json['links'] as $i => $link) {
    //clear links to the nodes in toVisit
    if ($link['source'] > $count) {
        unset($json['links'][$i]);
    }
    if ($link['target'] > $count) {
        unset($json['links'][$i]);
    }
}
$json['links'] = array_values($json['links']);

echo(json_encode($json));

//close the database connection
pg_close($dbconn);


//here be dragons^Wfunctions

function getPath($who) {
    global $dbconn, $path;

    $result = pg_Exec($dbconn, "SELECT shortestpath FROM test2 WHERE user_id = $who;");
    $row = pg_fetch_array($result, 0);//if there are multiple entries, just use the first

    //turn the string '1:2:3' into the array '1','2','3'
    $path = explode(":",$row[0]);
}

function addNode($who) {
    global $dbconn, $toVisit, $visited, $json;

    //find this nodes name
    $result = pg_Exec($dbconn, "SELECT username FROM users WHERE user_id = $who;");
    $num = pg_numrows($result);
    
    for ($i = 0; $i < $num; $i++) {
        $row = pg_fetch_array($result, $i);
        //$node['name'] = $row[0];
        $node['id'] = $who;
        //add this node to the json
        $json['nodes'][] = $node;
    }
}

function addLinks($who) {
    global $dbconn, $toVisit, $visited, $path, $json;

    //find our immediate links
    //round 1: user_id1
    $result = pg_Exec($dbconn, "SELECT user_id2, inf_1to2, inf_2to1 FROM relationship WHERE user_id1 = $who;");
    $num = pg_numrows($result);
    
    for ($i = 0; $i < $num; $i++) {
        $row = pg_fetch_array($result, $i);

        if ($row[1] = 0 && $row[2] = 0) { continue; }

        if ($row[0] > count($path) ) {
            //munge path
            getPath($row[0]);
            $sp = $path[$who];
            $dirty = true;
        } else {
            $sp = $path[$row[0]];
        }

        if ($sp == 1) {
            if ($dirty) {
                //unmunge path
                getPath($who);
            }
            continue;
        }

        //map index into the json array
        $here = count($json['nodes']) - 1;
        if (!in_array($row[0],$visited)) {
            $toVisit[] = $row[0];
            $there = count($visited) + count($toVisit) - 1;
        } else {
            $there = array_search($row[0],$visited);
        }

        //build the links
        if ($row[1] > 0) {
            $link['source'] = $here;
            $link['target'] = $there;
            $link['influence'] = (float)$row[1];
            $link['shortestpath'] = (float)$sp;
            $json['links'][] = $link;
        }

        //build the links
        if ($row[2] > 0) {
            $link['source'] = $there;
            $link['target'] = $here;
            $link['influence'] = (float)$row[2];
            $link['shortestpath'] = (float)$sp;
            $json['links'][] = $link;
        }

        if ($dirty) {
            //unmunge path
            getPath($who);
        }
    }

    //find our immediate links
    //round 2: user_id2
    $result = pg_Exec($dbconn, "SELECT user_id1, inf_1to2, inf_2to1 FROM relationship WHERE user_id2 = $who;");
    $num = pg_numrows($result);

    for ($i = 0; $i < $num; $i++) {
        $row = pg_fetch_array($result, $i);
    
        if ($row[1] = 0 && $row[2] = 0) { continue; }

        if ($row[0] > count($path) ) {
            //munge path
            getPath($row[0]);
            $sp = $path[$who];
            $dirty = true;
        } else {
            $sp = $path[$row[0]];
        }

        if ($sp == 1) {
            if ($dirty) {
                //unmunge path
                getPath($who);
            }
            continue;
        }

        //map index into the json array
        if (!in_array($row[0],$visited)) {
            $toVisit[] = $row[0];
            $there = count($visited) + count($toVisit) - 1;
        } else {
            $there = array_search($row[0],$visited);
        }

        //build the links
        if ($row[1] > 0) {
            $link['source'] = count($json['nodes']) - 1;
            $link['target'] = $there;
            $link['influence'] = (float)$row[1];
            $link['shortestpath'] = (float)$sp;
            $json['links'][] = $link;
        }
    
        //build the links
        if ($row[2] > 0) {
            $link['source'] = $there;
            $link['target'] = count($json['nodes']) - 1;
            $link['influence'] = (float)$row[2];
            $link['shortestpath'] = (float)$sp;
            $json['links'][] = $link;
        }
        
        if ($dirty) {
            //unmunge path
            getPath($who);
        }

    }

}

?>
