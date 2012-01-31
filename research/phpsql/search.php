<?php
//Test searching the fake db

$user = 1;
if (isset($_GET["id"])) {
  $id = $_GET["id"];

  if ( (int)$id == $id && $id >= 0 ) {
    $user = (int)$id;
  }
}

$dbconn = pg_Connect("host=capstone06.cs.pdx.edu dbname=fake user=postgres password=bees");
if (!$dbconn) {
    die("Error connecting to database.");
}

$result = pg_Exec($dbconn, "SELECT * FROM users WHERE user_id = $user;");
$num = pg_numrows($result);
for ($i = 0; $i < $num; $i++) {
    $row = pg_fetch_array($result, $i);
    print($row[0] . " " . $row[1] . "<br />");
}

$result = pg_Exec($dbconn, "SELECT user_id2, inf_1to2, inf_2to1 FROM relationship WHERE user_id1 = $user;");
$num = pg_numrows($result);
for ($i = 0; $i < $num; $i++) {
    $row = pg_fetch_array($result, $i);
    print($row[1] . ": " . $row[2] . "<br />");
}

$result = pg_Exec($dbconn, "SELECT user_id1, inf_1to2, inf_2to1 FROM relationship WHERE user_id2 = $user;");
$num = pg_numrows($result);
for ($i = 0; $i < $num; $i++) {
    $row = pg_fetch_array($result, $i);
    print($row[1] . ": " . $row[2] . "<br />");
}

pg_close($dbconn);

?>
