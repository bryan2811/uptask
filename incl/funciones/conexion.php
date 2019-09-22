<?php

$conn = new mysqli('localhost', 'root', 'root', 'uptask');

// Si hay un error que lo muestre
if($conn->connect_error) {
    echo $conn->connect_error;
}

// Corregir uso de acentos y ñ
$conn->set_charset('utf8');