<?php

//this file parse the @username form the tweet and count how many times each user talk to each other.


include 'simplexlsx/simplexlsx.class.php';
ini_set('max_execution_time', 0);
ini_set('memory_limit', '-1');



// sanitize the username from the tweet
function san($str){
    preg_match_all('/@([A-Za-z0-9-_]+)/', $str, $usernames);
    return $usernames[1];
}
// check time inside the tweet (eg. @11.30)
function TimeInside($str){
    $str2 = strstr($str, "@");
    // str2 is substring of str from @
    $word = explode(" ", $str2);
    $old = str_replace("@", "", $word[0]);
    return preg_match("/([0-9]+)(:|.)([0-9]+)/i",$old);
}

function removeDuplication($e1, $e2){
    $purpose1 = array();
    $purpose2 = array();
    
    foreach ($e1 as $item){
        $purpose1[] = $item['user_id1'].'*-*'.$item['user_id2'];
    }
    $count1 = array_count_values($purpose1);

    foreach ($e2 as $item){
        $purpose2[] = $item['user_id1'].'*-*'.$item['user_id2'];

    }
    $count2 = array_count_values($purpose2);

    $res = array();
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
    return $res;
}


function main(){

    $xlsx = new SimpleXLSX('verysmall.xlsx');
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

    // flood DB with username and user_id
    /*
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
    echo "Users successfully inserted!";
    }
    // free memory
    pg_free_result($result);
    echo "END: Users successfully inserted!";
    // close connection
    pg_close($dbcon);
    */
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

    // remove&count duplication
    $res = removeDuplication($e1, $e2);

     // flood database 2
    // flood table relationship with full data
    /*
    $dbcon = pg_connect("host=capstone06.cs.pdx.edu dbname=vmworld user=postgres password=bees");
    if (!$dbcon) {
         die("Error in connection: " . pg_last_error());
    }
    // execute query
    foreach($res as $item){
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
    
    // calc node degree
    foreach($res as $item){
        $source[] = $item['user_id1'];
        $target[] = $item['user_id2'];
    }

    $cs = array_count_values($source);
    $ct = array_count_values($target);

    // flood database 3
    // update table users with degree
    /*
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
        echo "Out-degree successfully updated!";
    }
    // free memory
    pg_free_result($result);

    // execute query for in_degree
    foreach($ct as $key=>$value){
        $sql = "UPDATE users SET in_degree = ('$value') WHERE user_id = ('$key')";
    $result = pg_query($dbcon, $sql);
        if (!$result) {
         die("Error in SQL query: " . pg_last_error());
        }
        echo "In-degree successfully updated!";
    }
    // free memory
    pg_free_result($result);

    // update sum_degree value
    $sql = "UPDATE users SET sum_degree=(out_degree + in_degree)";
    $result = pg_query($dbcon, $sql);
        if (!$result) {
         die("Error in SQL query: " . pg_last_error());
        }
    echo "Sum-degree successfully updated!";
    // free memory
    pg_free_result($result);

    // remove redundant nodes (695 nodes) with sum_degree = 0
    $sql = "DELETE FROM users WHERE sum_degree = 0";
    $result = pg_query($dbcon, $sql);
        if (!$result) {
         die("Error in SQL query: " . pg_last_error());
        }
        echo "Redundant users successfully deleted!";
    // free memory
    pg_free_result($result);

    // close connection
    pg_close($dbcon);
    */

    $unique_total = array_merge(array_unique(array_merge($source, $target)));
   

}

main();


?>

