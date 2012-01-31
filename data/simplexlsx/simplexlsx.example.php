<?php

include 'simplexlsx.class.php';

$xlsx = new SimpleXLSX('test.xlsx');
echo '<h1>$xlsx->rows()</h1>';
echo '<pre>';
print_r( $xlsx->rows() );
echo '</pre>';

echo '<h1>$xlsx->rowsEx()</h1>';
echo '<pre>';
print_r( $xlsx->rowsEx() );
echo '</pre>';

?>