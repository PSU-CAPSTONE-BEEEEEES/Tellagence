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
        if($username[$i] != $ary[$i]){
            $relation[] = array(
            'source' => $username[$i],
            'target' => $ary[$i]
            );
        }

    }
    $unique_total = array_merge(array_unique(array_merge($username, $ary)));

    // flood DB

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


    //print_r($unique_total);
    //print_r(count($unique_total));
    //print_r($relation);

    // replace username with their user_id
    // and re-order + regroup
    foreach($relation as &$item){
        $index = array_search($item['source'],$unique_total);
        $index2 = array_search($item['target'],$unique_total);
        if(!is_null($index)){
            if($index < $index2){
                $e1[] = array(
                'user_id1' => $index + 1,
                'user_id2' => $index2 + 1,
                );
            }else if($index > $index2){
                $e2[] = array(
                'user_id1' => $index2 + 1,
                'user_id2' => $index + 1,
                );
            }

        }
    }

    // remove duplication
    foreach ($e1 as $item){
        $purpose1[] = $item['user_id1'].'*-*'.$item['user_id2'];
    }
    $count1 = array_count_values($purpose1);

    foreach ($e2 as $item){
        $purpose2[] = $item['user_id1'].'*-*'.$item['user_id2'];

    }
    $count2 = array_count_values($purpose2);


    foreach($count1 as $key=>$value){
        if(isset($count2[$key])){
            $temp = explode('*-*', $key);
            $res[] = array(
                'user_id1' => $temp[0],
                'user_id2' => $temp[1],
                'inf_1to2' => $value,
                'inf_2to1' => $count2[$key],
            );
        }else{
            $temp = explode('*-*', $key);
            $res[] = array(
                'user_id1' => $temp[0],
                'user_id2' => $temp[1],
                'inf_1to2' => $value,
                'inf_2to1' => 0,
            );

        }
    }
    print_r($res);


    foreach($res as $item){
        $source[] = $item['user_id1'];
        $target[] = $item['user_id2'];
    }



    $cs = array_count_values($source);
    $ct = array_count_values($target);
    print_r($cs);
    print_r($ct);

    // flood database 3

    $dbcon = pg_connect("host=capstone06.cs.pdx.edu dbname=vmworld user=postgres password=bees");
    if (!$dbcon) {
         die("Error in connection: " . pg_last_error());
    }
    // execute query for out_degree
    foreach($cs as $key=>$value){
        $sql = "UPDATE users SET out_degree = ('$value') WHERE user_id = ('$key')";
    $result = pg_query($dbcon, $sql);
        if (!$result) {
         die("Error in SQL query: " . pg_last_error());
        }
        echo "Data successfully inserted!";
    }
    // free memory
    pg_free_result($result);

    // close connection

    // execute query for in_degree
    foreach($ct as $key=>$value){
        $sql = "UPDATE users SET in_degree = ('$value') WHERE user_id = ('$key')";
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
    

    die;
    /*
    // swap order
    foreach($last as &$item){
        if($item['user_id1'] < $item['user_id2']){
        // do nothing
        }else{
            // revert
            $t = $item['user_id1'];
            $item['user_id1'] = $item['user_id2'];
            $item['user_id2'] = $t;
            $v = $item['inf1to2'];
            $item['inf1to2'] = $item['inf2to1'];
            $item['inf2to1'] = $v;
        }
    }
    print_r($last);
    */


    

    // remove duplication
    /*
    foreach ($last as &$item){
        $purpose[] = array(
            $item['user_id1'].'*-*'.$item['user_id2'] => $item['inf1to2'].'*---*'.$item['inf2to1'],
        );
    }
    //$count = array_count_values($purpose);
    print_r($purpose);


    foreach($purpose as $item){
        
    }

    /*
    $result = array();

    //foreach($purpose as $item)


    foreach($purpose as $key=>$value) {
        $temp = explode('*-*', $value);
        if($temp[0] == $temp[1]){
            $result[] = array(
                'user_id1' => $temp[0],
                'user_id2' => $temp[1],
                'sum' => $value
                );
        }


    }
    // $result is array without duplication in relationship
    print_r($result);die;




    //$unique_total = array_merge(array_unique(array_merge($source, $target)));
    //print_r($unique_total);
    //print_r(count($unique_total));die;
    //print_r($unique_total);

    // $last is array with user_id from $result


    */
     // remove duplication
    /*
    foreach ($last as &$item){
        $purp[] = $item['user_id1'].'*-*'.$item['user_id2'];
    }
    $co = array_count_values($purp);
    print_r($purp);
    print_r($co);die;
    $result = array();
    foreach($co as $key=>$value) {
        $tp = explode('*-*', $key);
        if($tp[0] != $tp[1]){
            $out[] = array(
            'user_id1' => $temp[0],
            'user_id2' => $temp[1],
            'inf1to2' => $value
            );
        $source[] = $temp[0];
        $target[] = $temp[1];
        }
    }
    print_r($last);
    */
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

// flood database
/*
    $dbcon = pg_connect("host=capstone06.cs.pdx.edu dbname=vmworld user=postgres password=bees");
    if (!$dbcon) {
         die("Error in connection: " . pg_last_error());
    }
    die;
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
*/


// flood database 2
/*
    $dbcon = pg_connect("host=capstone06.cs.pdx.edu dbname=vmworld user=postgres password=bees");
    if (!$dbcon) {
         die("Error in connection: " . pg_last_error());
    }
    // execute query
    foreach($result as $item){
        $u1 = $item['user_id1'];
        $u2 = $item['user_id2'];
        $x = $item['inf_1to2'];
        $y = $item['inf_2to1'];
        $z = $x + $y;
        $sql = "INSERT INTO relationship (user_id1, user_id2, inf_1to2, inf_2to1, inf_sum) VALUES('$u1','$u2','$x','$y','$z')";
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
*/
?>

