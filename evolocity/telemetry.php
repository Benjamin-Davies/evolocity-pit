<?php
require_once('./includes/connect.php');

switch ($_SERVER['REQUEST_METHOD']) {
//case 'GET':
//  $query = $pdo->prepare('SELECT Username, LifeCount, Score FROM scoreboard ORDER BY Score DESC LIMIT 100');
//  $query->execute();
//  $scores = $query->fetchAll(PDO::FETCH_ASSOC);
//
//  header('Content-Type: application/json');
//
//  echo json_encode($scores);
//  break;
case 'POST':
  $query = $pdo->prepare('
    INSERT INTO telemetry
    VALUES (:time, :voltage, :current, :speed)');
  $query->bindValue('time', $_POST['time']);
  $query->bindValue('voltage', $_POST['voltage']);
  $query->bindValue('current', $_POST['current']);
  $query->bindValue('speed', $_POST['speed']);
  $query->execute();
  break;
}
?>
