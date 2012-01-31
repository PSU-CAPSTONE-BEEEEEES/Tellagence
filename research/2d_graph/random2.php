<?php

//determine graph size & shape
$count = 20;
if (isset($_GET["size"]) && $_GET["size"]>0)
{
	$size = $_GET["size"];
	$count = (int)$size;
}

$sparse = 3;
if (isset($_GET["factor"]))
{
  $factor = $_GET["factor"];
  if ( (int)$factor == $factor && $factor >= 0)
  {
    $sparse = $factor;
  }
}

//determine min and max influences
$min = 1;
if (isset($_GET["min"]) && ((int)$_GET["min"] == $_GET["min"]) )
{
    $min = $_GET["min"];
}

$max = $count;
if (isset($_GET["max"]) && ((int)$_GET["max"] == $_GET["max"]) )
{
    $max = $_GET["max"];
}

//begin JSON generation
function genName($index)
{
    $letters = range('a', 'z');
    $result = "";
    $q = floor($index / 26);
    $r = $index - ($q * 26);
    $result .= $letters[$r];
    while ($q >= 26)
    {
        $index /= 26;
        $q = floor($index / 26);
        $r = $index - ($q * 26);
        $result .= $letters[$r];
    }

    return $result;
}

$json['nodes'] = array();
for ($i=0; $i<$count; $i++) {
	$node = array();
    $node['name'] = genName($i);
    $node['degree'] = 0;
    $node['group'] = 0;
    $json['nodes'][] = $node;
}

$json['links'] = array();
for ($i=0; $i<count($json['nodes'])-1; $i++)
	for ($j=$i+1; $j<count($json['nodes']); $j++)
		if (rand(1, 10)==1) {
			$link = array();
			$link['source'] = $i;
            $link['target'] = $j;
            $link['influence'] = rand($min, $max);
            $link['distance'] = 0;
	    	$json['links'][] = $link;
		}
		
/**
 * LONG ADDED HIS WORKS HERE FOR PERSONAL RESEARCH
 */

// calculate degree for each node
foreach ($json['links'] as $link) {
	++$json['nodes'][ $link['source'] ]['degree'];
	++$json['nodes'][ $link['target'] ]['degree'];
}

// remember what is the highest degree
$highestDegree = -1;
foreach ($json['nodes'] as $node) {
	if ($node['degree'] > $highestDegree)
		$highestDegree = $node['degree'];
}

// sort array nodes in decreasing degree
// change array links accordingly regarding source and target
for ($i=0; $i<count($json['nodes'])-1; $i++)
	for ($j=$i+1; $j<count($json['nodes']); $j++)
		if ($json['nodes'][$j]['degree'] > $json['nodes'][$i]['degree']) {
			// switch their positions
			$temp = $json['nodes'][$i];
			$json['nodes'][$i] = $json['nodes'][$j];
			$json['nodes'][$j] = $temp;
			// change links accordingly
			foreach ($json['links'] as &$link) {
				if ($link['source']==$i || $link['source']==$j)
					$link['source'] = ($i+$j) - $link['source'];
				if ($link['target']==$i || $link['target']==$j)
					$link['target'] = ($i+$j) - $link['target'];
			}
		}
		
function BFS(&$json, $i) {
	$visitedNodes = 0;
	foreach ($json['links'] as $link) {
		// skip if NOT adjacent to $i
		if ($link['source']==$i)
			$j = $link['target'];
		else if ($link['target']==$i)
			$j = $link['source'];
		else
			continue;
			
		// skip if ALREADY visited
		if ($json['nodes'][$j]['group'] != 0)
			continue;
			
		// ok NOW sure to visit!
		$json['nodes'][$j]['group'] = $json['nodes'][$i]['group'];
		$json['nodes'][$j]['level'] = $json['nodes'][$i]['level'] + 1;
		++$visitedNodes;
	}
	// return the number of nodes visited
	return $visitedNodes;
}

// firstly assign group number (start from 1) and level=1 to the highest degreed nodes
$group = 0;
for ($i=0; $i<count($json['nodes']); $i++)
	if ($json['nodes'][$i]['degree']>=$highestDegree-1) {
		$group++;
		$json['nodes'][$i]['group'] = $group;
		$json['nodes'][$i]['level'] = 1;
	}
	else {
		break;
	}
//echo $group; die;

// now do BFS parallelly from the highest nodes
$currentLevel = 0;
do {
	++$currentLevel;
	$visitedNodes = 0;
	for ($i=0; $i<count($json['nodes']); $i++)
		// only BFS outward from current level
		if ($json['nodes'][$i]['level']==$currentLevel)
			$visitedNodes += BFS($json, $i);
} while ($visitedNodes>0);
// stop if no more nodes were visited

// now define big distance among different groups
$highestDistance = 300;
foreach ($json['links'] as &$link) {
	$i = $link['source'];
	$j = $link['target'];
	// make big distance if the 2 nodes belong to different groups
	if ($json['nodes'][$i]['group'] != $json['nodes'][$j]['group'])
		$link['distance'] = $highestDistance;
	// else: if they are in the same group
	else
		// config distance such that it is proportional to the different between their levels and how far they are from the level 1 node
		$link['distance'] = 0;
}

$degreeCounts = array();
for ($i=0; $i<=$highestDegree; $i++)
	$degreeCounts[$i] = 0;
foreach ($json['nodes'] as $node) {
	$degree = $node['degree'];
	$degreeCounts[$degree]++;
}
//print_r($degreeCounts); die;

//print_r($json); die;
echo(json_encode($json)); die;
		
?>
