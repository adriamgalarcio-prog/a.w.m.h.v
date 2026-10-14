<?php
function conectarDB(): mysqli {
$db = new mysqli("localhost", "root", "", "awmhv_db");
if ($db->connect_error) {
echo "Error de conexión: " . $db->connect_error;
exit;
}
return $db;
}