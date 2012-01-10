<?php

//determine graph size

$count = 20;

if (isset($_GET["size"])) {
  $size = $_GET["size"];

  if ( (int)$size == $size) {
    $count = (int)$size;
  }
}


$sparse = 3;

if (isset($_GET["factor"])) {
  $factor = $_GET["factor"];

  if ( (int)$factor == $factor && $factor >= 0) {
    $sparse = $factor;
  }
}


//begin JSON generation

$json['nodes'] = array();

for ($i = 1; $i <= $count; $i++) {

  $node['name'] = $i;

  $node['influence'] = array();
  for ($j = $i-1; $j > 0; $j--) {
    if ( rand(0,$sparse) == 0 ) {
      $node['influence'][] = array($j => rand(0,$count));
    }
  }

  $json['nodes'][] = $node;
}

echo(json_encode($json));

?>
