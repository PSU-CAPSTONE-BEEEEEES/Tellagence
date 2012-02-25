<?php
//search.php
//Search for nodes closest to some center node
//

//this is useful
set_time_limit(0);


//print a help message (maybe api?)
if (isset($_GET["help"])) {
    echo("This is a help message.");
die;
}


//connect to the database
$dbconn = pg_Connect("host=capstone06.cs.pdx.edu dbname=real user=postgres password=bees");
if (!$dbconn) {
    die("{}");
}

//
//Get parameters from _GET
//

//the center of our graph
if (isset($_GET["user"])) {
    $username = $_GET["user"];

    $user = findUser($username);
} else {
    $user = 1;
    if (isset($_GET["id"])) {
        $id = $_GET["id"];

        if ( (int)$id == $id && $id >= 0 ) {
            $user = (int)$id;
        }
    }
    $user = (string)$user;
}

//how many nodes to find around our center
if (isset($_GET["hops"])) {
    $hops = $_GET["hops"];
    if ( (int)$hops == $hops && $hops >= 0 ) {
        $hopCount = $hops;
    }
} else {
    $total = 100;
    if (isset($_GET["depth"])) {
        $depth = $_GET["depth"];

        if ( (int)$depth == $depth && $depth >= 0 ) {
            $total = (int)$depth;
        }
    }
}

//or maybe, search for a specified subgraph
if (isset($_GET["subgraph"])) {
    $sub = $_GET["subgraph"];
    if ( (int)$sub == $sub && $sub >= 0) {
        $subgraph = $sub;
    }
}

//only look at links with one influence of 0
//and the other is greater than the limit
if (isset($_GET["cutoff"])) {
    $cutoff = $_GET["cutoff"];
    if ( (int)$cutoff == $cutoff && $cutoff >= 0) {
        $limit = $cutoff;
    }
}

//
//end of parameters
//

//list of nodes to visit
$toVisit = array();

//nodes we've visited so far
$visited = array();

//shortest paths from user X to all other users
$path = array();

//the list of nodes we've connected with links
$nodes = array();

//get all the other nodes
if (isset($subgraph)) {
    $result = pg_Exec($dbconn, "SELECT user_ids FROM subgraphs WHERE subgraph_id = $subgraph;");
    $row = pg_fetch_array($result, 0);
    $toVisit = explode(":",$row[0]);

    foreach($toVisit as $node) {
        addnode($node);
    }
} else if (isset($hopCount) ) {
    //add the central node
    $visited[] = $user;
    addNode($user);
    findNodes($user);

    for ($i = 0; $i < $hopCount && count($toVisit) > 0; $i++) {
        foreach ($toVisit as $x => $next) {
            if(in_array($next, $visited)) {
                continue;
            }

            addNode($next);
            findNodes($next);

            $visited[] = $next;
            unset($toVisit[$x]);
        }
        //findNodes has modified toVisit,
        //but the foreach has a stale version
        //the next iteration will be the new copy
    }
} else {
    //add the central node
    $visited[] = $user;
    addNode($user);
    findNodes($user);

    while (count($visited) < $total && count($toVisit) > 0) {
        //get the first node to visit
        $next = array_shift($toVisit);

        if(in_array($next, $visited)) {
            continue;
        }

        addNode($next);
        findNodes($next);

        $visited[] = $next;
    }
}

pruneNodes();

echo('{"links":[');

//link the nodes

$idx = 0;
$prev = 0;
while ($idx < sizeof($nodes) && $prev == 0) {
    $prev = addLinks($nodes[$idx]);
    $idx += 1;
}

ob_start();
while ($idx < sizeof($nodes)) {
    ob_flush();
    echo(',');
    $prev = addLinks($nodes[$idx]);
    if ($prev == 0) {
        ob_clean();
    }
    $idx += 1;
}

echo(']');
echo(',');
echo('"nodes":' . json_encode($nodes) . "}");
ob_end_flush();

//close the database connection
pg_close($dbconn);

//
//here be dragons^Wfunctions
//

function findUser($who) {
    global $dbconn;

    $result = pg_Exec($dbconn, "SELECT user_id FROM users WHERE username = '$who';");
    $num = pg_numrows($result);
    if ($num == 0) {
        die('{"nodes":[]}');
    }
    $row = pg_fetch_array($result, 0);//if there are multiple entries, just use the first
    return (string)$row[0];
}

function getPath($who) {
    global $dbconn, $path;

    $result = pg_Exec($dbconn, "SELECT shortestpath FROM shortestpaths WHERE user_id = $who;");
    if (pg_numrows($result) == 0) {
        $path = NULL;
        return;
    }

    //if there are multiple entries, just use the first
    $row = pg_fetch_array($result, 0);

    //turn the string '1:2:3' into the array '1','2','3'
    $path = explode(":",$row[0]);
}

function addNode($who) {
    global $dbconn, $nodes;

    //find this nodes name
    $result = pg_Exec($dbconn, "SELECT username, sum_degree FROM users WHERE user_id = $who;");
    $num = pg_numrows($result);

    for ($i = 0; $i < $num; $i++) {
        $row = pg_fetch_array($result, $i);
        $node['name'] = $row[0];
        $node['sum_degree'] = $row[1];
        $node['id'] = $who;
        //add this node to the json
        $nodes[] = $node;
    }
}

function findNodes($who) {
    //add this nodes neighboors to toVisit
    global $dbconn, $visited, $toVisit;

    $result = pg_Exec($dbconn, "SELECT user_id2 FROM relationship WHERE user_id1 = $who;");
    $num = pg_numrows($result);

    for ($i = 0; $i < $num; $i++) {
        $row = pg_fetch_array($result, $i);
        if (!in_array($row[0],$visited)) {
            $toVisit[] = $row[0];
        }
    }

    $result = pg_Exec($dbconn, "SELECT user_id1 FROM relationship WHERE user_id2 = $who;");
    $num = pg_numrows($result);

    for ($i = 0; $i < $num; $i++) {
        $row = pg_fetch_array($result, $i);
        if (!in_array($row[0],$visited)) {
            $toVisit[] = $row[0];
        }
    }

}

function pruneNodes() {
    global $dbconn, $nodes, $limit;
    $tmpNodes = array();

    foreach ($nodes as $node) {
        $result = pg_exec($dbconn, "SELECT in_degree, out_degree FROM users WHERE user_id = " . $node['id'] . ';');
        $array = pg_fetch_array($result, 0);
        $in = $array[0];
        $out = $array[1];

        //we want to prune nodes where one of {in,out} is 0, and the other is below the limit
        if ($in == 0 && $out < $limit) {
            continue;
        }
        if ($out == 0 && $in < $limit) {
            continue;
        }

        $tmpNodes[] = $node;
    }

    $nodes = $tmpNodes;
}

function addLinks($here) {
    global $dbconn, $toVisit, $visited, $path, $nodes;
    $numLinks = 0;

    //get the shortest paths from the db
    getPath($here['id']);

    //our index in the nodes array
    //here is the target, not the source
    //because we want the source to have a lower user_id
    //but the higher user_id has the relavent shortestpath information
    $target = array_search($here, $nodes);

    //get the influences from the db
    $result1 = pg_Exec($dbconn, "SELECT user_id2, inf_1to2, inf_2to1 FROM relationship WHERE user_id1 = " . $here['id'] . ";");
    $num1 = pg_numrows($result1);

    $result2 = pg_Exec($dbconn, "SELECT user_id1, inf_1to2, inf_2to1 FROM relationship WHERE user_id2 = " . $here['id'] . ";");
    $num2 = pg_numrows($result2);

    $first = true;

    //create links between us and all the other nodes
    foreach ($nodes as $source => $there) {

        //we only want to add the link once, lets use the node with more paths in the db
        if ($here['id'] <= $there['id']) {
            //move on to the next node in the nodes array
            continue;
        }

        $numLinks += 1;

        if ($first) {
            $first = false;
        } else {
            echo(',');
        }

        //first check if we are user_id1
        for ($i = 0; $i < $num1; $i++) {
            $row = pg_fetch_array($result1, $i);
            if ($row[0] == $there['id']) {
                $link['source'] =  $source;
                $link['target'] =  $target;
                $link['inf_1to2'] = (int)$row[1];
                $link['inf_2to1'] = (int)$row[2];
                $link['shortestpath'] = (float)$path[$there['id'] - 1];
                echo(json_encode($link));

                //move on to the next node in the nodes array
                continue 2;
            }
        }

        //next check user_id2
        for ($i = 0; $i < $num2; $i++) {
            $row = pg_fetch_array($result2, $i);
            if ($row[0] == $there['id']) {
                $link['source'] =  $source;
                $link['target'] =  $target;
                $link['inf_1to2'] = (int)$row[1];
                $link['inf_2to1'] = (int)$row[2];
                $link['shortestpath'] = (float)$path[$there['id'] - 1];
                echo(json_encode($link));

                //move on to the next node in the nodes array
                continue 2;
            }
        }

        //i guess there's no direct link
        $link['source'] =  $source;
        $link['target'] =  $target;
        $link['inf_1to2'] = 0;
        $link['inf_2to1'] = 0;
        $link['shortestpath'] = (float)$path[$there['id'] - 1];
        echo(json_encode($link));
    }
    return $numLinks;
}

/*?>*/
