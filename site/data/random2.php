<?php

//determine graph size & shape

$count = 20;
if (isset($_GET["size"]))
{
  $size = $_GET["size"];
  if ( (int)$size == $size)
  {
    $count = (int)$size;
  }
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

$min = 0;
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
    while ($q > 0)
    {
        $index -= 26;
        $q = floor($index / 26);
        $r = $index - ($q * 26);
        $result .= $letters[$r];
    }

    return $result;
}

$json['nodes'] = array();
for ($i = 0; $i <= $count; $i++) {
    $node['name'] = genName($i);
    $json['nodes'][] = $node;
}

$json['links'] = array();
for ($i = 0; $i <= $count; $i++) {
    for ($j = $i-1; $j > 0; $j--) {
        if ( rand(0,$sparse) == 0 ) {
            $link['source'] = $i;
            $link['target'] = $j;
            $link['influence'] = rand($min,$max);
        }
    }
    $json['links'][] = $link;
}

echo(json_encode($json));

?>
