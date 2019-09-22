<?php 

$proyecto = $_POST['proyecto'];
$accion = $_POST['accion'];

if($accion === 'crear') {

    // Importar la conexión
    include '../funciones/conexion.php';

    try {
        // Realizar la consulta a la BD
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?)");
        $stmt->bind_param('s', $proyecto);
        $stmt->execute();
        if($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'nombre_proyecto' => $proyecto
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    } catch(Exception $e) {
        // En caso de error, Tomar la exepción
        $respuesta = array(
            'error' => $e->getMessage()
        );   
    }
    
    echo json_encode($respuesta);
    
}