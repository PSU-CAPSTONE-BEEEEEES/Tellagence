<?php

//determine graph size

$count = 20;

if (isset($_GET["size"])) {
  $size = $_GET["size"];

  if ( (int)$size == $size) {
    $count = (int)$size;
  }
}

$minimum = 20;

if (isset($_GET["min"])) {
  $min = $_GET["min"];

  if ( (int)$min == $min) {
    $minimum = (int)$min;
  }
}

$maximum = 20;

if (isset($_GET["max"])) {
  $max = $_GET["size"];

  if ( (int)$max == $size) {
    $maximum = (int)$max;
  }
}


$sparse = 3;

if (isset($_GET["factor"])) {
  $factor = $_GET["factor"];

  if ( (int)$factor == $factor && $factor >= 0) {
    $sparse = $factor;
  }
}

$delta = 0;

if (isset($_GET["offset"])) {
  $offset = $_GET["offset"];

  if ( (int)$offset == $offset && $offset >= 0) {
    $delta = $offset;
  }
}


//begin JSON generation

$json['nodes'] = array();

for ($i = $delta; $i <= ($count + $delta); $i++) {

  $node['name'] = $i;

  $node['influence'] = array();
  for ($j = $i-1; $j > 0; $j--) {
    if ( rand(0,$sparse) == 0 ) {
      $node['influence'][] = array("$j" => rand($minimum,$maximum));
    }
  }

  $json['nodes'][] = $node;
}

echo(json_encode($json));

?>
