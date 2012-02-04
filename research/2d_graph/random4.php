<?php

function genName($index) {
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

// graph w/ 2 subgraphs
$json['nodes'] = array();
for ($i=0; $i<16; $i++) {
	$json['nodes'][$i] = array(
		'name' 		=> genName($i), 
		'degree' 	=> 0, 
		'tree' 		=> $i+1
	);
}

$linkGroups = array(
	array(
		'source'=>0, 
		'targetGroups'=>array(
			array(
				'nodes'=>array(1, 2, 3, 4), 
				'influence'=>array(50, 100)
			)
		), 
	), 
	array(
		'source'=>3, 
		'targetGroups'=>array(
			array(
				'nodes'=>array(2, 4), 
				'influence'=>array(50, 100)
			)
		), 
	), 
	array(
		'source'=>11, 
		'targetGroups'=>array(
			array(
				'nodes'=>array(0, 2, 10), 
				'influence'=>array(1, 5)
			), 
			array(
				'nodes'=>array(12, 13, 14, 15), 
				'influence'=>array(50, 100)
			)
		), 
	), 
	array(
		'source'=>5, 
		'targetGroups'=>array(
			array(
				'nodes'=>array(6, 7, 10), 
				'influence'=>array(50, 100)
			)
		), 
	), 
	array(
		'source'=>8, 
		'targetGroups'=>array(
			array(
				'nodes'=>array(7, 9), 
				'influence'=>array(50, 100)
			)
		), 
	), 
);
$json['links'] = array();
foreach ($linkGroups as $linkGroup) {
	$source = $linkGroup['source'];
	foreach ($linkGroup['targetGroups'] as $targetGroup) {
		foreach ($targetGroup['nodes'] as $node) {
			$link = array();
			$link['source'] = $source;
			$link['target'] = $node;
			$link['influence'] = rand($targetGroup['influence'][0], $targetGroup['influence'][1]);
			$link['distance'] = 0;
			$link['mst'] = 0;
			$json['links'][] = $link;
		}
	}
}
//print_r($json); die;

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
//print_r($json); die;
		
// sort links in descending order of influence
function cmp($a, $b) {
    if ($a['influence']==$b['influence']) return 0;
    return ($a['influence']<$b['influence']) ?1 :-1 ;
}
usort($json['links'], "cmp");

// scale distances base on influences
//$f = ($json['links'][0]['influence'] - $json['links'][count($json['links'])-1]['influence'] + 1) * 5;
$f = ($json['links'][0]['influence']) * 5;
foreach ($json['links'] as &$link)
	$link['distance'] = round($f/$link['influence'], 0);
//print_r($json); die;
	
// combine 2 sub-trees
function combineTrees(&$nodes, $i, $j) {
	$treeIndex = min(array($nodes[$i]['tree'], $nodes[$j]['tree']));
	$newIndex = $nodes[$i]['tree'] + $nodes[$j]['tree'] - $treeIndex;
	foreach ($nodes as &$node) {
		if ($node['tree']==$newIndex)
			$node['tree'] = $treeIndex;
	}
}

function dfsMst(&$nodes, $links, $start, $end) {
	// mark this $start node as visited
	$nodes[$start]['visited'] = 1;
	// start spreading out on MST, from all links surrounding $start
	foreach ($links as $link)
		if ($link['mst'] && $link['source']==$start || $link['target']==$start) {
			$j = $link['source']+$link['target'] - $start;
			// skip if already visited this node
			if ($nodes[$j]['visited'])
				continue;
			// else
			if ($j==$end)
				return $link['distance'];
			return $link['distance'] + dfsMst($nodes, $links, $j, $end);
		}
}

// remember how many minimum links being added to the mst - stop when it reaches (total nodes - 1)
$mstLinks = 0;
// start spanning the tree
// for each link (from smallest distance to biggest distance)
foreach ($json['links'] as &$link) {
	// see the source and target of this link
	$i = $link['source'];
	$j = $link['target'];
	// if this link connects 2 different trees
	if ($json['nodes'][$i]['tree'] != $json['nodes'][$j]['tree']) {
		// mark this link as a link of the mst
		$link['mst'] = 1;
		// combine these 2 trees to one
		combineTrees($json['nodes'], $i, $j);
		// rememeber how many links we have so far in the mst
		++$mstLinks;
		// stop if $mstLinks == total nodes - 1
		if ( $mstLinks==(count($json['nodes'])-1) )
			break;
	}
}

// now recalculate all distances again
foreach ($json['links'] as &$link) {
	// retain the scaled distance if this is a link of the mst
	// otherwise set its distance to 0 as disregard
	$nodes = $json['nodes'];
	foreach ($nodes as &$node)
		$node['visited'] = 0;
	$link['distance'] = ($link['mst']) 
						?$link['distance']
						:dfsMst($nodes, $json['links'], $link['source'], $link['target']);
}

// finally sort links in ascending order of distance
function ascDistance($a, $b) {
    if ($a['distance']==$b['distance']) return 0;
    return ($a['distance']<$b['distance']) ?-1 :1 ;
}
usort($json['links'], "ascDistance");

//print_r($json); die;
echo(json_encode($json)); die;
		
?>