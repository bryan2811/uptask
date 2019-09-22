eventListeners();

function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);    
}

function validarRegistro(e) {
    e.preventDefault();

    let usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;

        if(usuario === '' || password === '') {
            // La validación falló
            swal({
                type: 'error',
                title: 'Error!',
                text: 'Ambos campos son obligatorios!'
              });
        } else {
            // Ambos campos son correctos, Mandar a ejecutar Ajax

            // Datos que se envían al servidor
            let datos = new FormData();
            datos.append('usuario', usuario);
            datos.append('password', password);
            datos.append('accion', tipo);

            // Llamado a Ajax

            // Crear el objeto
            const xhr = new XMLHttpRequest();

            // Abrir la conexión
            xhr.open('POST', 'incl/models/modelo-admin.php', true);

            // Pasar los datos
            xhr.onload = function() {
                if(this.status === 200) {
                    let respuesta = JSON.parse(xhr.responseText);
                    console.log(respuesta);

                    // Si la respuesta es correcta
                    if(respuesta.respuesta === 'correcto') {
                        // Si es un nuevo usuario
                        if(respuesta.tipo === 'crear') {
                            swal({
                                type: 'success',
                                title: 'Usuario Creado!',
                                text: 'El usuario se creó correctamente'
                              });
                        } else if(respuesta.tipo === 'login') {
                            swal({
                                type: 'success',
                                title: 'Login Correcto!',
                                text: 'Presiona OK para abrir el dashboard'
                              })
                              .then(resultado => {
                                  if(resultado.value) {
                                      window.location.href = 'index.php';
                                  }
                              });
                        }
                    } else {
                        // Hubo un error
                        swal({
                            type: 'error',
                            title: 'Error',
                            text: 'Hubo un error'
                          });
                    }
                }
            }

            // Enviar petición
            xhr.send(datos);

        }
}