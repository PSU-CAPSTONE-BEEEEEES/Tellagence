<?php



include 'simplexlsx/simplexlsx.class.php';
ini_set('max_execution_time', 0);
    
    $xlsx = new SimpleXLSX('small.xlsx');
    echo '<h1>$xlsx->rows()</h1>';


    list($num_cols, $num_rows) = $xlsx->dimension();
    echo $num_rows;

echo '<pre>';

    $a = $xlsx->rows();

// move to DB
/*
$dbconn = pg_connect("host=capstone06.cs.pdx.edu dbname=vmworld user=root password=");
if (!$dbconn) {
     die("Error in connection: " . pg_last_error());
 }
echo 'hahah';die;
*/
    // usernames & tweets
    for($i = 1; $i <= $num_rows; $i++)
    {
        $active = $a[$i][2];
        $node = array(
            'name' => $active,
            //'influence' =>
        );

        print_r($active);
        print_r('<br \>');
        //print_r($a[$i][4]);
        for ($j = 1; $j <= $num_rows; $j++)
        {
            $str = $a[$i][4];
            if(stristr($str,"@")){
               $str1 = $a[$i][4];
               $str2 = strstr ($str1, "@");
               $word = explode(" ", $str2);
               $word[0] = rtrim($word[0], ":");
               $word[0] = str_replace("@","",$word[0]);
            }

        }
        print_r($word[0]);
        print_r('<br \>');
    }

    //print_r( $xlsx->rows() );


echo '</pre>';    


?>

