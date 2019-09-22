eventListeners()
// Lista de proyectos
let listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {
    // Botón para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    // Botón para una nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);

    // Botones para las acciones de las tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
}

function nuevoProyecto(e) {
    e.preventDefault();

    // Crea un <input> para el nombre del nuevo proyecto
    const nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" class="input-task" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    // Seleccionar el ID con el nuevoProyecto
    const inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    // Al presionar enter crear el proyecto

    inputNuevoProyecto.addEventListener('keypress', function(e) {
        const tecla = e.which || e.keyCode;

        if(tecla === 13) {
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }
    });
}

function guardarProyectoDB(nombreProyecto) {
    
    // Crear llamado a Ajax
    const xhr = new XMLHttpRequest();
    
    // Enviar datos por formData
    const datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');

    // Abrir la conexión
    xhr.open('POST', 'incl/models/modelo-proyecto.php', true);
      
    // Pasar los datos
    xhr.onload = function() {
        if(this.status === 200) {
            // Obtener datos de la respuesta
            const respuesta = JSON.parse(xhr.responseText);
            const proyecto = respuesta.nombre_proyecto,
                  id_proyecto = respuesta.id_insertado,
                  tipo = respuesta.tipo,
                  resultado = respuesta.respuesta

            // Comprobar la insercción
            if(resultado === 'correcto') {
                // Fue exitoso
                if(tipo === 'crear') {
                    // Se creó un nuevo Proyecto
                    // Inyectar en el HTML
                    const nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                            ${proyecto}
                        </a>
                    `;

                    // Agregar al HTML
                    listaProyectos.appendChild(nuevoProyecto);

                    //Enviar alerta
                    swal({
                        type: 'success',
                        title: 'Proyecto Creado',
                        text: 'El proyecto: ' + proyecto + ' se creó correctamente'
                    })
                    .then(resultado => {
                        if(resultado.value) {
                            // Redireccionar a la nueva URL
                            window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                        }
                    });

                } else {
                    // Se actualizó o eliminó
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

    // Enviar la petición
    xhr.send(datos);

}

// Agregar una nueva tarea al proyecto actual
function agregarTarea(e) {
    e.preventDefault();
    
    let nombreTarea = document.querySelector('.nombre-tarea').value;
    // Validar que el campo tenga algo escrito
    if(nombreTarea === '') {
        swal({
            type: 'error',
            title: 'Error',
            text: 'Una tarea no puede ir vacía'
        })
    } else {
        // La tarea existe, insertar en PHP

        // Crear el objeto
        const xhr = new XMLHttpRequest();

        // Crear FormData
        // Nos permite almacenar llave y valor, y permite enviar por AJAX más fácilmente

        const datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        // Abrir la conexión
        xhr.open('POST', 'incl/models/modelo-tareas.php', true);

        // Cargarlo
        xhr.onload = function() {
            if(this.status === 200) {
                // Todo correcto
                const respuesta = JSON.parse(xhr.responseText);
                const resultado = respuesta.respuesta,
                      tarea = respuesta.tarea,
                      id_insertado = respuesta.id_insertado,
                      tipo = respuesta.tipo;

                if(resultado === 'correcto') {
                    // Se agregó correctamente
                    if(tipo === 'crear') {
                        swal({
                            type: 'success',
                            title: 'Tarea Creada',
                            text: 'La tarea: ' + tarea + ' se creó correctamente'
                        });

                        // Seleccionar el párrafo con la lista vacía
                        const ParrafoListaVacia = document.querySelectorAll('.lista-vacia');
                        if(ParrafoListaVacia.length > 0) {
                            document.querySelector('.lista-vacia').remove();
                        }

                        // Construir template
                        const nuevaTarea = document.createElement('li');

                        // Agregamos el ID
                        nuevaTarea.id = 'tarea:'+id_insertado;
                        
                        // Agregar la clase tarea
                        nuevaTarea.classList.add('tarea');

                        // Construir el HTML
                        nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        `;

                        // Agregarlo al HTML
                        const listado = document.querySelector('.listado-pendientes ul');
                        listado.appendChild(nuevaTarea);

                        // Limpiar el formulario
                        document.querySelector('.agregar-tarea').reset();
                    }
                } else {
                    // Hubo un error
                    swal({
                        type: 'error',
                        title: 'Error!',
                        text: 'Hubo un error'
                    });
                }
            }
        }
        
        // Enviar la petición
        xhr.send(datos);
    }

}

// Cambia el estado de las tareas o las elimina
function accionesTareas(e) {
    e.preventDefault();

    // Check
    if(e.target.classList.contains('fa-check-circle')) {
        if(e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target), 0;
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }

    // Borrar
    if(e.target.classList.contains('fa-trash')) {
        Swal({
            title: 'Seguro(a)?',
            text: "Esta acción no se puede deshacer",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, borrar!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.value) {

                const tareaEliminar = e.target.parentElement.parentElement;
                // Borrar de la BD
                eliminarTareaBD(tareaEliminar);

                // Borrar del HTML
                tareaEliminar.remove();

              Swal(
                'Eliminado!',
                'La tarea fue eliminada.',
                'success'
              )
            }
          })
    }
}

// Completa o descompleta una tarea 
function cambiarEstadoTarea(tarea, estado) {
    const idTarea = tarea.parentElement.parentElement.id.split(':');

    // Llamado a Ajax

    // Crear el objeto
    const xhr = new XMLHttpRequest();

    // información
    const datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);

    // Abrir la conexión
    xhr.open('POST', 'incl/models/modelo-tareas.php', true);
    
    // Cargar los datos
    xhr.onload = function() {
        if(this.status === 200) {
            console.log(JSON.parse(xhr.responseText));
        }
    }

    // Enviar petición
    xhr.send(datos);


}

// Elimina las tareas de la BD
function eliminarTareaBD(tarea) {
    const idTarea = tarea.id.split(':');

    // Llamado a Ajax

    // Crear el objeto
    const xhr = new XMLHttpRequest();

    // información
    const datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');

    // Abrir la conexión
    xhr.open('POST', 'incl/models/modelo-tareas.php', true);
    
    // Cargar los datos
    xhr.onload = function() {
        if(this.status === 200) {
            console.log(JSON.parse(xhr.responseText));

            // Comprobar que haya tareas restantes
            const listaTareasRestantes = document.querySelectorAll('li.tarea');
            if(listaTareasRestantes.length === 0) {
                document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
            }
        }
    }

    // Enviar petición
    xhr.send(datos);
}
