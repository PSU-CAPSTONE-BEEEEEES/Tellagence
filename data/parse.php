<?php
/*
$string = 'RT @username: lorem ipsum @cjoudrey @longnguyen,@letien etc...';
preg_match_all('/@([A-Za-z0-9_]+)/', $string, $usernames);
print_r($usernames);die;
*/

include 'simplexlsx/simplexlsx.class.php';
ini_set('max_execution_time', 0);
ini_set('memory_limit', '-1');
function san($str){
    preg_match_all('/@([A-Za-z0-9-_]+)/', $str, $usernames);
    return $usernames[1];
}
function TimeInside($str){
    $str2 = strstr($str, "@");
    // str2 is substring of str from @
    $word = explode(" ", $str2);
    $old = str_replace("@", "", $word[0]);
    return preg_match("/([0-9]+)(:|.)([0-9]+)/i",$old);
}

function main(){
    $xlsx = new SimpleXLSX('simplexlsx/vmworld.xlsx');
    list($num_cols, $num_rows) = $xlsx->dimension();

    $a = $xlsx->rows();
    // usernames & tweets
    $ary = array();
    for($i = 0; $i < $num_rows; $i++)
    {

        if (strpos($a[$i][4], '@') !== false){
            $str = $a[$i][4];
        // $str = full tweet contains @
            // RT
            if(strpos($str, 'RT') !== false){
                if(!TimeInside($str)){
                $new = san($str);
                // revert Source and Destination
                    if($new){
                        foreach ($new as $item){
                        $username[] = strtolower($item);
                        $ary[] = strtolower($a[$i][2]);
                        }
                    }
                }
            }
            // @
            else{
                if(!TimeInside($str)){
                    $new = san($str);
                    if($new){
                        foreach ($new as $item){
                            $ary[] = strtolower($item);
                            $username[] = strtolower($a[$i][2]);
                        }
                    }
                }
            }

        }
    }
    for ($i = 0; $i < count($username); $i++){
        $relation[] = array(
            'source' => $username[$i],
            'target' => $ary[$i]
        );
    }
    foreach ($relation as $item){
    $purpose[] = $item['source'].'*-*'.$item['target'];
    }

    $count = array_count_values($purpose);

    $result = array();
    foreach ($count as $key=>$value) {
        $temp = explode('*-*', $key);
        if($temp[0] != $temp[1]){
            $result[] = array(
            'source' => $temp[0],
            'target' => $temp[1],
            'inf' => $value
            );
        $source[] = $temp[0];
        $target[] = $temp[1];
        }
    }
    $unique_total = array_merge(array_unique(array_merge($source, $target)));
    print_r($unique_total);
    // flood database
    $dbcon = pg_connect("host=capstone06.cs.pdx.edu dbname=vmworld user=postgres password=bees");
    if (!$dbcon) {
         die("Error in connection: " . pg_last_error());
    }
    // execute query
    for($i = 0; $i < count($unique_total); $i++){
        $t = $i + 1;
        $sql = "INSERT INTO users (user_id, username) VALUES('$t' , '$unique_total[$i]')";
    $result = pg_query($dbcon, $sql);
    if (!$result) {
     die("Error in SQL query: " . pg_last_error());
    }
    echo "Data successfully inserted!";
    }
    // free memory
    pg_free_result($result);

    // close connection
    pg_close($dbcon);
}


main();



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


// move to DB
/*
$dbconn = pg_connect("host=capstone06.cs.pdx.edu dbname=vmworld user=postgres password=bees");
if (!$dbconn) {
     die("Error in connection: " . pg_last_error());
 }
echo 'hahah';die;
*/

?>

