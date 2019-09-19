<?php
require_once('./includes/connect.php');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
header("Access-Control-Allow-Origin: *");

switch ($_SERVER['REQUEST_METHOD']) {
case 'GET':
  $query = $pdo->prepare('SELECT * FROM telemetry');
  $query->execute();
  $data = $query->fetchAll(PDO::FETCH_ASSOC);

  header('Content-Type: application/json');

  echo json_encode($data);
  break;
case 'POST':
  $input = json_decode(file_get_contents('php://input'), true);

  $query = $pdo->prepare('
    INSERT INTO telemetry
    VALUES (:time, :voltage, :current, :speed, :battery_voltage, :location)');
  foreach ($input as $key => $value) {
    $query->bindValue($key, $value);
  }
  $res = $query->execute();
  if (!$res) {
    echo 'no result';
  } else {
    echo $res;
  }
  break;
default:
  http_response_code(405);
  break;
}
?>
