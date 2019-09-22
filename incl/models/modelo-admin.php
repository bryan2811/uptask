<?php 

// Validar entradas
$usuario = $_POST['usuario'];
$password = $_POST['password'];
$accion = $_POST['accion'];

// Código para crear los administradores
if($accion === 'crear') {

    // Hashear passwords
    $opciones = array (
        'cost' => 12
    );
    $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
    // Importar la conexión
    include '../funciones/conexion.php';

    try {
        // Realizar la consulta a la BD
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?)");
        $stmt->bind_param('ss', $usuario, $hash_password);
        $stmt->execute();
        if($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion
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

// Código que loguee a los admin
if($accion === 'login') {
    
    include '../funciones/conexion.php';

    try {
        // Seleccionar el admin de la BD
        $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ?");
        $stmt->bind_param('s', $usuario);
        $stmt->execute();
        // loguear el usuario
        $stmt->bind_result($nombre_usuario, $id_usuario, $pass_usuario);
        $stmt->fetch();
        if($nombre_usuario) {
            // El usuario existe, verificar el password
            if(password_verify($password, $pass_usuario )) {
                // Iniciar la sesión
                session_start();
                $_SESSION['nombre'] = $usuario;
                $_SESSION['id'] = $id_usuario;
                $_SESSION['login'] = true;
                // login Correcto
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'nombre' => $nombre_usuario,
                    'tipo' => $accion
                );
            } else {
                // Login Incorrecto, enviar error
                $respuesta = array(
                    'resultado' => 'Password Incorrecto'
                );
            }
        } else {
            $respuesta = array(
                'error' => 'Usuario no existe'
            );
        }
        $stmt->close();
        $conn->close();
    } catch(Exception $e) {
        // En caso de error, Tomar la exepción
        $respuesta = array(
            'pass' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);

}