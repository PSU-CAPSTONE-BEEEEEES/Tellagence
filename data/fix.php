<?php

// this file makes user_id list continuous in the users table --> enhance the performance
// update 2 table: users and relationship

function cmp($a, $b)
{
    if ($a == $b) {
        return 0;
    }
    return ($a < $b) ? -1 : 1;
}


// down & flood realusers table
$dbcon = pg_connect("host=capstone06.cs.pdx.edu dbname=real user=postgres password=bees");
if (!$dbcon) {
     die("Error in connection: " . pg_last_error());
}
// execute query
$sql = "SELECT user_id FROM users";
$result = pg_query($dbcon, $sql);

$row = array();
for ($i=0;$i < pg_num_rows($result); $i++) {
        $row = pg_fetch_array($result,$i);
        $inspector[] = $row[0];
}
// free memory
pg_free_result($result);

usort($inspector, "cmp");
print_r($inspector);

foreach($inspector as $key=>$value){
    $old = $value;
    $new = $key + 1;
    if($new != $old){
    $sql0 = "UPDATE users SET user_id = ('$new') WHERE user_id = ('$old')";
    $sql1 = "UPDATE relationship SET user_id1 = ('$new') WHERE user_id1 = ('$old')";
    $sql2 = "UPDATE relationship SET user_id2 = ('$new') WHERE user_id2 = ('$old')";
    $result0 = pg_query($dbcon, $sql0);
    $result1 = pg_query($dbcon, $sql1);
    $result2 = pg_query($dbcon, $sql2);
        if (!$result0 || !$result1 || !$result2) {
         die("Error in SQL query: " . pg_last_error());
        }
        echo "Good update";
    }
}
// free memory
pg_free_result($result0);
pg_free_result($result1);
pg_free_result($result2);
// close connection
pg_close($dbcon);

?>
