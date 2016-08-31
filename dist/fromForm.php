<?php
$rawPost = file_get_contents('php://input');

if($rawPost) {
    $record = json_decode($rawPost);
}