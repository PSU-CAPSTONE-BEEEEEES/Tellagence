<?php

// get data from Jesus
$size = ($_REQUEST['size']) ?(int)$_REQUEST['size'] :10;
$data = file_get_contents("http://web.cecs.pdx.edu/~kjharke/data.php?size=$size");

// reprocess data for easier later manipulation in rendering
$oldG = json_decode($data);
//print_r($oldG); die;

// build a new graph based on the old one
$names = array('Derek', 'John', 'Aren', 'Long', 'Huy', 'Tien', 'Alisa',
				'Risa', 'Reberto', 'Bart', 'Matt', 'Nitin', 'Fling', 'Flung', 'Flang');
$newG = new stdClass();
// nodes
$newG->nodes = array();
foreach ($oldG->nodes as $node) {
	$newNode = new stdClass();
	$newNode->offset	= $node->name - 1;
	$newNode->name 		= $node->name;
	$newNode->title 	= $names[rand(0, count($names)-1)];
	$newG->nodes[] = $newNode;
}
// links
$newG->links = array();
foreach ($oldG->nodes as $node) {
	foreach ($node->influence as $influence) {
		$temp = get_object_vars($influence);
		foreach ($temp as $key=>$val) {
			$link = new stdClass();
			$link->source 	= $key - 1;
			$link->target 	= $node->name - 1;
			$link->inf 		= $val;
			$newG->links[] = $link;
			break;
		}
	}
}
//print_r($newG); die;

// output
echo json_encode($newG); die;

?>