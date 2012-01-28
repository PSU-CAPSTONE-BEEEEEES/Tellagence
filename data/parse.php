<?php



include 'simplexlsx/simplexlsx.class.php';
ini_set('max_execution_time', 0);
ini_set('memory_limit', '-1');
    
    $xlsx = new SimpleXLSX('verysmall.xlsx');
    echo '<h1>$xlsx->rows()</h1>';


    list($num_cols, $num_rows) = $xlsx->dimension();
    echo $num_rows;

echo '<pre>';

    $a = $xlsx->rows();

// move to DB
/*
$dbconn = pg_connect("host=capstone06.cs.pdx.edu dbname=vmworld user=postgres password=bees");
if (!$dbconn) {
     die("Error in connection: " . pg_last_error());
 }
echo 'hahah';die;
*/
    // usernames & tweets
    $ary = array();
    for($i = 1; $i <= $num_rows; $i++)
    {

        if (strpos($a[$i][4], '@') !== false){
            $str = $a[$i][4];
        // $str = full tweet contains @
            // RT
            if(strpos($str, 'RT') !== false){
                $str3 = strstr($str, "RT @");
                $word3 = explode(" ", $str3);
                $word3[1] = rtrim($word3[1], ":");
                $word3[1] = rtrim($word3[1], ",");
                $word3[1] = str_replace("@","",$word3[1]);
                $patterns = '.';
                $replacements = '';

                // revert Source and Destination
                if($word3[1]){
                    //$word3[1] = preg_replace($patterns, $replacements, $word3[1]);
                    $username[] = str_replace("@","",$word3[1]);
                    $ary[] = $a[$i][2];
                }
            }
            // @
            else{
                $str2 = strstr($str, "@");
                // str2 is substring of str from @
                $word = explode(" ", $str2);
                $word[0] = rtrim($word[0], ":");
                $word[0] = rtrim($word[0], ",");
                $word[0] = rtrim($word[0], ".");
                $word[0] = str_replace("@","",$word[0]);
                $patterns = '...';
                $replacements = '';

                if($word[0]){
                    //$word[0] = preg_replace($patterns, $replacements, $word[0]);
                    $ary[] = $word[0];
                    $username[] = $a[$i][2];
                }

            }

        }
    }
    // $ary3 is array of username that come after RT @
    //print_r($ary3);
    // $ary is array of username that come after @ or RT @
    //print_r($ary);

    for ($i = 0; $i < count($username); $i++){
        $relation[] = array(
            'source' => $username[$i],
            'target' => $ary[$i]
        );
    }
    $total = array_merge($username, $ary);
    $unique_total = array_unique($total);
    echo count($unique_total);
    print_r($unique_total);die;
//print_r(array_unique($username));die;
// create purpose array
foreach ($relation as $item){
    $purpose[] = $item['source'].'*-*'.$item['target'];
}

$count = array_count_values($purpose);

$result = array();
    foreach ($count as $key=>$value) {
        $temp = explode('*-*', $key);
        $result[] = array(
            'source' => $temp[0],
            'target' => $temp[1],
            'inf' => $value
        );
    }
print_r($result); 



//begin JSON part
/*

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
            // count it
            $link['influence'] = rand($min,$max);
	    $json['links'][] = $link;
        }
    }
}

echo(json_encode($json));
*/


function array_unique_multidimensional($input)
{
    $serialized = array_map('serialize', $input);
    $unique = array_unique($serialized);
    return array_intersect_key($input, $unique);
}

?>

