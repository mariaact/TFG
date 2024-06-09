const mongoose = require('mongoose');
const { MongoClient, ConnectionCheckOutFailedEvent } = require('mongodb');
const { Console } = require('console');
const { generateKey } = require('crypto');
const PreProcesador = require('./preProcesado.js');
const bcrypt = require('bcrypt');
const { waitForDebugger } = require('inspector');


const dbURI = 'mongodb://127.0.0.1:27017/Series';
const dbName = 'Series'
const client = new MongoClient(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = client.db(dbName);
const nombresSet = new Set();

mongoose.connect(dbURI, {
}).then(() => {
  console.log('Conexión establecida correctamente con MongoDB');
}).catch((error) => {
  console.log('Error al conectar a MongoDB:', error);
});

async function obtenerTodaLaInformacionUsuario(nombreUsuario) {
  const collection = db.collection('Users');
  const resultado = collection.findOne({ "nombre": nombreUsuario });
  return resultado;
}

async function cambiarUsuarioEmailPerfil(valorNuevo, valorActual, parametro) {
  const collection = db.collection('Users');
  console.log(valorActual + '*/*/*/*/*/*')
  const usuarioExiste = await comprobarnombreUsuario(valorActual);
  const comprobarSiExisteUsuarioConEseNombre = await comprobarnombreUsuario(valorNuevo);
  if (parametro == 'nombre') {
    if (validarNombre(valorNuevo).length == 0) {
      if (comprobarSiExisteUsuarioConEseNombre) {
        return 'El nombre de usuario ya existe'
      } else {
        if (!usuarioExiste) {
          return 'Usuario No Existe';
        } else {
          console.log('parametro: ' + parametro + 'valorActual: ' + valorActual + 'valorNuevo ' + valorNuevo)
          const nombreUsuarioCambiado = await collection.updateOne(
            {
              "nombre": valorActual
            },
            {
              $set: {
                "nombre": valorNuevo
              }
            }
          );
          if (nombreUsuarioCambiado) {
            return true;
          } else {
            return 'No se ha podido cambiar el nombre';
          }
        }
      }
    } else {
      return validarNombre(valorNuevo);
    }
  } else if (parametro == 'email') {

    if (validarEmail(valorNuevo).length != 0) {
      return validarEmail(valorNuevo);
    } else {
      console.log('parametro: ' + parametro + 'valorActual: ' + valorActual + 'valorNuevo ' + valorNuevo)
      const nombreUsuarioCambiado = await collection.updateOne(
        {
          "email": valorActual
        },
        {
          $set: {
            "email": valorNuevo
          }
        }
      );
      if (nombreUsuarioCambiado) {
        return true;
      } else {
        return 'No se ha podido cambiar el nombre';
      }
    }
  } else if (parametro == 'perfil') {
    console.log('perdfiiil')
    const nombreUsuarioCambiado = await collection.updateOne(
      {
        "perfiles.nombre": valorActual,
      },
      {
        $set: {
          "perfiles.$.nombre": valorNuevo
        }
      }
    );
    if (nombreUsuarioCambiado) {
      return true;
    } else {
      return false;
    }
  }
}

function validarNombre(nombre) {
  let textoError = "";
  var patronNombre = /^[a-z]+$/;

  if (nombre.length === 0) {
    textoError += "El nombre está vacío</br>";
  } else if (!patronNombre.test(nombre)) {
    textoError += "El nombre de usuario no cumple el patrón</br>";
  }

  return textoError;
}


function validarEmail(email) {
  let error = false;
  let textoError = "";
  var patronCorreo = /[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}/;
  email = email.toString();

  if (email.length != 0 && !patronCorreo.test(email)) {
    textoError = "El formato de correo es incorrecto</br>";
  }
  return textoError;
}


async function registrarUsuario(nombreUsuario, contra, email) {
  const collection = db.collection('Users');
  const saltRounds = 10; //el algoritmo de hashing dará 10 vueltas
  const hashedPassword = await bcrypt.hash(contra, saltRounds);
  const resultado = await collection.insertOne({
    nombre: nombreUsuario,
    contraseña: hashedPassword,
    email: email,
    perfiles: [
      { nombre: nombreUsuario, iconUser: '/images/userIcon.png', peliculas: [] },
      { nombre: 'Kids', iconUser: '/images/userIconKids.png', peliculas: [] }
    ]
  });
  return resultado;
}

//LogIn
async function comprobarUsuario(nombreUsuario, contra) {
  const collection = db.collection('Users');
  const usuarioExiste = await collection.findOne({ nombre: nombreUsuario });
  if (usuarioExiste) {
    const verificacionContra = await bcrypt.compare(contra, usuarioExiste.contraseña);
    if (verificacionContra) {
      return usuarioExiste;
    } else {
      // throw new Error('Contraseña invalida')
      return '<p class="errorLogIn">Contraseña invalida</p></br>'
    }
  } else {
    //throw new Error('Usuario no encontrado')
    return '<p class="errorLogIn">El usuario no existe</p></br>'
  }
}


async function comprobarnombreUsuario(nombreUsuario) {
  const collection = db.collection('Users');
  const usuarioExiste = await collection.findOne({ nombre: nombreUsuario });
  if (usuarioExiste) {
    // throw new Error('Contraseña invalida')
    return true
  } else {
    //throw new Error('Usuario no encontrado')
    return false
  }
}

async function cambiarContrasenna(nombreUsuario, contra) {
  const collection = db.collection('Users');
  const usuarioExiste = await comprobarnombreUsuario(nombreUsuario);
  if (usuarioExiste) {
    if (validarContrasenna(contra).length == 0) {
      const saltRounds = 10; //el algoritmo de hashing dará 10 vueltas
      const hashedPassword = await bcrypt.hash(contra, saltRounds);
      const contraCambiada = await collection.updateOne(
        {
          "nombre": nombreUsuario,
        },
        {
          $set: {
            contraseña: hashedPassword
          }
        }
      );
      if (contraCambiada) {
        return true;
      } else {
        return 'La contraseña no ha podido ser cambiada';
      }
    } else {
      return 'Formato de contraseña invalido'
    }
  } else {
    return 'El usuario no existe'
  }
}
function validarContrasenna(pass) {
  let textoError = "";
  var patronContrasenna = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (pass.length === 0) {
    textoError += "La contraseña está vacía</br>";
  } else if (!patronContrasenna.test(pass)) {
    textoError += "La contraseña no cumple el patrón</br>";
  }
  return textoError;
}


async function listaPeliculasUsuario(nombre, perfil) {
  const collection = db.collection('Users');
  const usuario = await collection.findOne({ nombre: nombre });

  if (usuario) {
    let perfiluser;
    for (let i = 0; i < usuario.perfiles.length; i++) {
      if (usuario.perfiles[i].nombre === perfil) {
        perfiluser = usuario.perfiles[i];
        break;
      }
    }
    if (perfiluser) {
      const peliculasPerfil = perfiluser.peliculas;
      return peliculasPerfil || [];
    }
  } else {
    console.log("Usuario no encontrado o el perfil  no está asociado al usuario.");
  }
}

async function borrarDatosUsuario(usuario) {
  console.log('--------------' )

  const collection = db.collection('Users');
  const usuario1 = await collection.findOne({ nombre: usuario });
  console.log('--------------' + usuario1)
  try {
    // Intenta eliminar el usuario
    const result = await collection.deleteOne({nombre: usuario} );

    // Verifica si la operación fue reconocida y si se eliminó algún documento
    if (result.acknowledged && result.deletedCount > 0) {
      console.log(`Usuario ${usuario} eliminado exitosamente.`);
      return true;
    } else {
      console.log(`No se pudo eliminar el usuario ${usuario}.`);
      return false;
    }
  } catch (error) {
    console.error(`Error al intentar eliminar el usuario ${usuario}:`, error);
    return false;
  }
}

/*
borrarDatosUsuario('prueba')
  .then(resultado => {
    console.log('Resultado:', resultado);
  })
  .catch(error => {
    console.error('Error al obtener información de películas:', error);
  });*/



async function borrarPerfil(usuario, perfil) {
  const collection = db.collection('Users');
  const result = await collection.updateOne(
    { nombre: usuario },
  { $pull: { perfiles: {nombre: perfil}}});
  if(result){
    return true;
  }else{
    false
  }
}


async function obtenerIDUsuario(usuario) {
  const collection = db.collection('Users');
  return await collection.findOne({ nombre: usuario })
    .then(usuarioEncontrado => {
      if (!usuarioEncontrado) {
        throw new Error('Usuario no encontrado')
      }
      return usuarioEncontrado._id
    }).catch(error => {
      console.error('Error al obtener ID del usuario:', error);
      throw error;
    });
}

async function comprobarExistenciausuario(usuario) {
  const collection = db.collection('Users');
  return await collection.findOne({ nombre: usuario })
    .then(usuarioEncontrado => {
      if (!usuarioEncontrado) {
        throw new Error('Usuario no encontrado')
      }
      return usuarioEncontrado
    }).catch(error => {
      console.error('Error al obtener ID del usuario:', error);
      throw error;
    });
}


async function comprobarExistenciaPerfil(usuario, perfil) {
  const usuarioExistente = await comprobarExistenciausuario(usuario);
  if (usuarioExistente) {
    const collection = db.collection('Users');
    console.log(perfil)
    return await collection.findOne({ "perfiles.nombre": perfil })
      .then(perfilEncontrado => {
        if (!perfilEncontrado) {
          throw new Error('Perfil no encontrado')
        }
        return perfilEncontrado
      }).catch(error => {
        console.error('Error al obtener el nombre del perfil:', error);
        throw error;
      });
  } else {
    throw new Error('Usuario no encontrado')
  }
}



async function añadirNuevoPerfil(usuario, perfil) {
  try {
    const collection = db.collection('Users');
    const usuarioID = await obtenerIDUsuario(usuario);
    const nuevoPerfil = {
      nombre: perfil,
      iconUsuario: '/images/userIcon.png',
      peliculas: []
    };
    const usuarioActualizado = await collection.findOneAndUpdate(
      { _id: usuarioID },
      { $push: { perfiles: nuevoPerfil } },
      { new: true }
    )
    if (!usuarioActualizado) {

      throw new Error('Usuario no encontrado');
    }
    console.log('Perfil añadido correctamente:', usuarioActualizado);
    return usuarioActualizado;
  } catch (error) {
    console.error('Error al añadir perfil:', error);
  };
}

async function obtenerPerfilesDeUnUsuario(usuario) {
  try {
    const collection = db.collection('Users');
    const usuarioEncontrado = await collection.findOne({ nombre: usuario })

    if (!usuarioEncontrado) {
      throw new Error('Usuario no encontrado')
    }
    const nombrePerfiles = usuarioEncontrado.perfiles.map(perfil => perfil.nombre);
    return nombrePerfiles;
  } catch (error) {
    console.error('Error al obtener ID del usuario:', error);
    throw error;
  };
}

async function agregarPeliculaListaPerfil(usuario, perfil, pelicula) {
  try {
    const collection = db.collection('Users');
    const usuarioID = await obtenerIDUsuario(usuario);
    const usuarioActualizado = await collection.findOneAndUpdate(
      {
        _id: usuarioID,
        "perfiles.nombre": perfil
      },
      { $addToSet: { "perfiles.$.peliculas": pelicula } },
      { new: true }
    );
    if (!usuarioActualizado) {

      throw new Error('Peliula no encontrado');
    }
    console.log('Pelicula añadido correctamente:', usuarioActualizado);
    return usuarioActualizado;
  } catch (error) {
    console.error('Error al añadir pelicula:', error);
  };
}

async function eliminarPeliculaListaPerfil(usuario, perfil, pelicula) {
  try {
    const collection = db.collection('Users');
    const usuarioID = await obtenerIDUsuario(usuario);
    const usuarioActualizado = await collection.findOneAndUpdate(
      {
        _id: usuarioID,
        "perfiles.nombre": perfil
      },
      { $pull: { "perfiles.$.peliculas": pelicula } },
      { new: true }
    );
    if (!usuarioActualizado) {

      throw new Error('Pelicula no encontrado');
    }
    console.log('Pelicula eliminado correctamente:', usuarioActualizado);
    return usuarioActualizado;
  } catch (error) {
    console.error('Error al eliminar pelicula:', error);
  };
}

async function obtenerTodosLosGeneros() {
  const collection = db.collection('generos');
  const generos = await collection.find().toArray();
  return generos;
}

//nombre
async function obtenerTodosLosNombresGeneros() {
  const collection = db.collection('generos');
  const generos = await collection.find().toArray();
  return generos.map(genero => genero.name);
}

async function obtenerIDGenero(generos) {

  const collection = db.collection('generos');
  const query = Array.isArray(generos) ? { name: { $in: generos } } : { name: generos };
  const id_genero = await collection.find(query);
  const infoIDGenero = await id_genero.toArray();

  const ids = infoIDGenero.map(document => document.id);
  return ids;
}


async function obtenerNombreGenero(idsGenros) {
  const collection = db.collection('generos');
  const nombresSet = new Set();

  for (const idGenero of idsGenros) {
    const id_genero = await collection.findOne({ id: idGenero });
    if (id_genero && id_genero.name) {
      nombresSet.add(id_genero.name);
    }
  }

  return Array.from(nombresSet);
}



async function obtenerInfoPeliculasGenero(genero) {

  try {
    const idGeneroObjeto = await obtenerIDGenero(genero);
    const idGeneros = idGeneroObjeto.map(id => parseInt(id));
    const cursor = db.collection('peliculas').find({ genre_ids: { $in: idGeneros } });
    const peliculas = await cursor.toArray();
    const peliculasFiltroGenero = new Set();
    peliculas.forEach(document => {
      if (!peliculasFiltroGenero.has(document)) {
        peliculasFiltroGenero.add(document);
      }
    });
    return Array.from(peliculasFiltroGenero);
  } catch (error) {
    console.error('Error al obtener información de películas:', error);
    throw error;
  }
}


async function peliculasMasVistas() {
  const collection = db.collection('peliculas');
  const peliculasPopulares = await collection.find().sort({ popularity: -1 }).limit(50);
  const infoPeliculasPopulares = await peliculasPopulares.toArray();
  await infoPeliculasPopulares.forEach(document => {
    if (!nombresSet.has(document.id)) {
      nombresSet.add(document);
    }
  });
  return Array.from(nombresSet);
}


async function peliculaDetalles(titulo) {
  const collection = db.collection('peliculas');
  const infoPelicula = await collection.findOne({ title: titulo });
  return infoPelicula;
}

async function comprobarPeliculaLista(nombre, perfil, pelicula) {
  const listaPeliculasPerfil = await listaPeliculasUsuario(nombre, perfil)
  const result = listaPeliculasPerfil.includes(pelicula);
  return result;
}


async function obtenerTitulosPeliculas() {
  const collection = db.collection('peliculas');
  const tituloPeliculas = await collection.find().toArray();
  return tituloPeliculas.map(titulo => titulo.title);
}


async function obtenerTitulosPeliculasInfantiles() {
  const tituloPeliculas = await ObtenerPeliculasMasPopularesInfantiles();
  return tituloPeliculas.map(titulo => titulo.title);
}


async function ObtenerPeliculasInfantiles() {
  const collection = db.collection('peliculas');
  const peliculasInfantiles = await collection.findOne({ certificacion: 'APTA' })
  return peliculasInfantiles;
}


async function ObtenerPeliculasMasPopularesInfantiles() {
  const collection = db.collection('peliculas');
  const peliculasInfantiles = await collection.find({ certificacion: 'APTA' }).sort({ popularity: -1 })
  return peliculasInfantiles.toArray();
}


async function ObtenerPeliculasInfantilesSegunElGenero(genero) {
  const collection = db.collection('peliculas');
  const generoID = await obtenerIDGenero(genero);
  console.log(generoID + '*/*/')
  console.log(typeof (generoID))
  const peliculasInfantiles = await collection.find({ certificacion: 'APTA', genre_ids: parseInt(generoID) });

  return peliculasInfantiles.toArray();
}

async function obtenerGenerosPeliculasInfantiles() {
  const collection = db.collection('peliculas');
  const peliculasInfantilesCursor = await collection.find({ certificacion: 'APTA' });
  const peliculasInfantilesArray = await peliculasInfantilesCursor.toArray();

  const generos = new Set();

  peliculasInfantilesArray.forEach(pelicula => {
    pelicula.genre_ids.forEach(genero => {
      generos.add(genero);
    });
  });

  const nombregenero = await obtenerNombreGenero(Array.from(generos))

  return nombregenero;
}
/*
obtenerGenerosPeliculasInfantiles()
  .then(resultado => {
    console.log('Resultado:', resultado);
  })
  .catch(error => {
    console.error('Error al obtener información de películas:', error);
  });
*/



/*
obtenerTodosLosComentarios('Dune: Parte dos')
  .then(resultado => {
    console.log('Resultado:', resultado);
  })
  .catch(error => {
    console.error('Error al obtener información de películas:', error);
  });**/
/*
añadirNuevoComenatrio('Dune: Parte dos', 'la pelicula me ha gustado bastantes, es muy entretenida', 'maria', 'julia')
.then(resultado => {
console.log('Resultado:', resultado);
})
.catch(error => {
console.error('Error al obtener información de películas:', error);
});
*/




/*
async function ObtenerTituloGeneroDescripcionDeTodasPeliculas() {
  try {
    const collection = db.collection('peliculas');
    const todasLasPeliculas = await collection.find();

    console.log(todasLasPeliculas)

   // const nombrePerfiles = usuarioEncontrado.perfiles.map(perfil => perfil.nombre);
    return 0;
  } catch (error) {
    console.error('Error al obtener ID del usuario:', error);
    throw error;
  };
}*/

/*
async function ObtenerTituloGeneroDescripcionDeTodasPeliculas() {
  const resultado = [];
  const collection = db.collection('peliculas');
  const todasLasPeliculas = await collection.find().toArray();
  for (const pelicula of todasLasPeliculas) {
    const infoTransformada = {
      titulo: pelicula.title,
      genero: await obtenerNombreGenero(pelicula.genre_ids),
      descripcion: pelicula.overview,
      imagen: pelicula.poster_path
    };
    resultado.push(infoTransformada)
  }
  return resultado;
}*/

async function ObtenerTituloGeneroDescripcionDeTodasPeliculas() {
  const collection = db.collection('peliculas');
  const todasLasPeliculas = await collection.find().toArray();
  const todosLosGeneros = await obtenerTodosLosGeneros();
  const mapaIDNombreGeneros = new Map();
  todosLosGeneros.forEach(genero => {
    mapaIDNombreGeneros.set(genero.id, genero.name);
  });

  const transformacion = todasLasPeliculas.map(async (pelicula) => {
    const nombreGenero = pelicula.genre_ids.map(id => mapaIDNombreGeneros.get(id)).join(', ');
    return {
      titulo: pelicula.title,
      genero: nombreGenero,
      descripcion: pelicula.overview,
      imagen: pelicula.poster_path
    };
  });
  return Promise.all(transformacion);
}

async function obtenerLasCincoPeliculasMasNuevas() {
  const collection = db.collection('peliculas');
  var fecha = new Date();
  var ano = fecha.getFullYear();
  var mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
  var dia = ('0' + fecha.getDate()).slice(-2); 
  var fechaActual = ano + '-' + mes + '-' + dia;
  console.log(fechaActual)
  const peliculasOrdenacionFecha = await collection.find({ release_date: { $lte: fechaActual } }).sort({ release_date: - 1 }).limit(5);

  return peliculasOrdenacionFecha.toArray();

}

/*
obtenerLasCincoPeliculasMasNuevas()
  .then(resultado => {
    console.log('Resultadoo:', resultado);
    console.log(resultado.length)
  })
  .catch(error => {
    console.error('Error al obtener información de películas:', error);
  });*/


async function todasLasValoraciones() {
  const collection = db.collection('valoraciones');
  const valoraciones = await collection.find().toArray();
  //const nombrePerfiles = new Set();
  const nombrePerfiles = new Map();

  for (const valoracion of valoraciones) {
    for (const perfil in valoracion.perfil) {
      if (!nombrePerfiles.has(perfil)) {
        nombrePerfiles.set(valoracion.usuario, perfil)

      }
    }
  }

  let final = [];

  for (const [usuario, perfil] of nombrePerfiles) {
    console.log(`Usuario: ${usuario}, Perfil: ${perfil}`);
    const resultado = await mostrarTodasLasValoraciones(usuario, perfil);
    final = final.concat(resultado);
  }

  return final;
}






async function comprobarExistenciausuarioValoraciones(usuario) {
  const collection = db.collection('valoraciones');
  return await collection.findOne({ usuario: usuario })
    .then(usuarioEncontrado => {
      if (!usuarioEncontrado) {
        return false;
      }
      return true;
    }).catch(error => {
      console.error('Error al obtener ID del usuario:', error);
      throw error;
    });
}

async function mostrarTodasLasValoraciones(usuario, nombrePerfil) {
  const collection = db.collection('valoraciones');
  //const usuarioResultado = await collection.findOne({ 'usuario': 'maria' }, { projection: { 'perfil.maria': 1 } });

  const usuarioResultado = await collection.findOne({ 'usuario': usuario }, { projection: { [`perfil.${nombrePerfil}`]: 1 } });
  if (!usuarioResultado) {
    return false;
  }
  return usuarioResultado.perfil[nombrePerfil];
}

async function analisisSentimiento(nombreUsuario) {
  const collection = db.collection('valoraciones');

  // Realizar la consulta para obtener la información del usuario
  const usuario = await collection.findOne({ 'usuario': nombreUsuario });

  // Verificar si se encontró el usuario
  if (!usuario) {
    console.log('Usuario no encontrado.');
    return;
  }

  // Retornar el perfil del usuario con la estructura deseada
  return {
    "perfil": {
      [nombreUsuario]: usuario.perfil[nombreUsuario]
    }
  };
}/*
analisisSentimiento('maria')
.then(resultado => {

console.log(resultado );
})
.catch(error => {
console.error('Error al obtener información de películas:', error);
});*/
/*
async function prueba(){
  const informacionUsuario = await  analisisSentimiento('maria');
console.log('Información del usuario:', informacionUsuario);
const peliculasValoradas = informacionUsuario.perfil.maria;

// Iterar sobre cada película y acceder a su información
peliculasValoradas.forEach((pelicula, index) => {
  console.log(`Película ${index + 1}:`);
  console.log("Título:", pelicula.pelicula);
  console.log("Comentario:", pelicula.comentario);
  console.log("Valoración:", pelicula.valoracion);
  console.log("Géneros:", pelicula.genero);
});
}
prueba()
analisisSentimiento('maria')
.then(resultado => {

console.log(resultado );
})
.catch(error => {
console.error('Error al obtener información de películas:', error);
});
*/

async function mostrarTodasLasValoracionesYLosGeneros(nombrePerfil) {
  const valoraciones = await mostrarTodasLasValoraciones(nombrePerfil);
  const infoPeliculas = await ObtenerTituloGeneroDescripcionDeTodasPeliculas();

  if (!valoraciones || !infoPeliculas) {
    console.log("Error al obtener las valoraciones o la información de las películas.");
    return;
  }

  // Iteramos sobre cada valoración del perfil
  for (let valoracion of valoraciones) {
    // Buscamos la información de la película en infoPeliculas
    const peliculaInfo = infoPeliculas.find(peli => peli.titulo === valoracion.pelicula);

    // Si encontramos la información de la película, actualizamos la valoración con el género
    if (peliculaInfo) {
      valoracion.genero = peliculaInfo.genero;
    } else {
      console.log(`No se encontró información de la película "${valoracion.pelicula}".`);
    }
  }
  await guardarValoracionesActualizadas(nombrePerfil, valoraciones);
}

async function guardarValoracionesActualizadas(nombrePerfil, valoraciones) {
  const collection = db.collection('valoraciones');
  const query = { 'usuario': nombrePerfil };
  const updateDoc = {
    $set: {
      [`perfil.${nombrePerfil}`]: valoraciones
    }
  };

  try {
    await collection.updateOne(query, updateDoc);
    console.log("Valoraciones actualizadas y guardadas en la base de datos correctamente.");
  } catch (error) {
    console.error("Error al guardar las valoraciones actualizadas:", error);
  }
}

async function añadirNuevaValoracion(pelicula, valoracion, usuario, perfil) {
  try {
    const collection = db.collection('valoraciones');
    const usuarioExiste = await comprobarExistenciausuario(usuario);
    const usuarioValorado = await comprobarExistenciausuarioValoraciones(usuario);
    const perfilEncontrado = await comprobarExistenciaPerfil(usuario, perfil);

    console.log(usuarioExiste + '  *******    ' + perfilEncontrado)

    if (usuarioExiste && perfilEncontrado) {
      if (usuarioValorado == false) {
        console.log('NOOO esxiste valoracoon')
        await collection.insertOne({
          "usuario": usuario,
          "perfil": {
            [perfil]: [
              {
                "pelicula": pelicula,
                "valoracion": valoracion
              }
            ]
          }
        });
        console.log("Se ha añadido una nueva valoración de la película " + pelicula)
      } else {
        console.log('estoy en el if perfil enconttrado y si ha sido valorado ')
        const count = await collection.countDocuments({
          "usuario": usuario,
          [`perfil.${perfil}.pelicula`]: pelicula
        });

        if (count == 0) {
          await collection.updateOne(
            {
              "usuario": usuario
            },
            {
              $push: {
                [`perfil.${perfil}`]: {
                  "pelicula": pelicula,
                  "valoracion": valoracion
                }
              }
            }
          );
        } else {

          await collection.updateOne(
            {
              "usuario": usuario,
              [`perfil.${perfil}.pelicula`]: pelicula // Encuentra el documento con el nombre de la película en el perfil específico
            },
            {
              $set: {
                [`perfil.${perfil}.$[elem].valoracion`]: valoracion // Modifica la valoración de la película
              }
            },
            {
              arrayFilters: [{ "elem.pelicula": pelicula }] // Filtra el documento que contiene la película específica
            }
          );

        }

        console.log("Se actualizado tu valoracion de la película: " + pelicula)

      }
    } else {
      throw new Error('Usuario o Perfil no encontrado');
    }
  } catch (error) {
    console.error('Error al añadir una valoración:', error);
  };
}



async function añadirNuevoComenatrio(pelicula, comentario, usuario, perfil) {
  try {
    const collection = db.collection('valoraciones');
    const usuarioExiste = await comprobarExistenciausuario(usuario);
    const usuarioValorado = await comprobarExistenciausuarioValoraciones(usuario);
    const perfilEncontrado = await comprobarExistenciaPerfil(usuario, perfil);

    if (usuarioExiste && perfilEncontrado) {
      if (usuarioValorado == false) {
        await collection.insertOne({
          "usuario": usuario,
          "perfil": {
            [perfil]: [
              {
                "pelicula": pelicula,
                "comentario": comentario
              }
            ]
          }
        });
        console.log("Se ha añadido un nuevo comentario de la película " + pelicula)
      } else {
        const count = await collection.countDocuments({
          "usuario": usuario,
          [`perfil.${perfil}.pelicula`]: pelicula
        });

        if (count == 0) {
          await collection.updateOne(
            {
              "usuario": usuario
            },
            {
              $push: {
                [`perfil.${perfil}`]: {
                  "pelicula": pelicula,
                  "comentario": comentario
                }
              }
            }
          );
        } else {
          await collection.updateOne(
            {
              "usuario": usuario,
              [`perfil.${perfil}.pelicula`]: pelicula
            },
            {
              $set: {
                [`perfil.${perfil}.$[elem].comentario`]: comentario
              }
            },
            {
              arrayFilters: [{ "elem.pelicula": pelicula }]
            }
          );
        }
        console.log("Se actualizado tu comentario de la película: " + pelicula)
      }
    } else {
      throw new Error('Usuario o Perfil no encontrado');
    }
  } catch (error) {
    console.error('Error al añadir un comentario:', error);
  };
}

async function obtenerTodosLosComentarios(peliculaBuscada) {
  try {
    const collection = db.collection('valoraciones');
    // Definimos el nombre de la película que queremos buscar
    let resultArray = [];

    await collection.aggregate([
      { $project: { usuario: 1, perfiles: { $objectToArray: "$perfil" } } },
      { $unwind: "$perfiles" },
      { $unwind: "$perfiles.v" },
      { $match: { "perfiles.v.pelicula": peliculaBuscada, "perfiles.v.comentario": { $exists: true } } },
      {
        $project: {
          usuario: 1,
          nombrePerfil: "$perfiles.k",
          pelicula: "$perfiles.v.pelicula",
          comentario: "$perfiles.v.comentario"
        }
      }
    ]).forEach(doc => {
      resultArray.push({
        usuario: doc.usuario,
        nombrePerfil: doc.nombrePerfil,
        pelicula: doc.pelicula,
        comentario: doc.comentario
      });
    });
    return resultArray
  } catch (error) {
    console.error('Error al añadir un comentario:', error);
  };
}

async function ObtenerInformacionPeliculasRecomendaciones() {
  const collection = db.collection('recomendaciones');
  const todasLasPeliculas = await collection.find().toArray();
  return todasLasPeliculas;
}

async function ObtenerPeliculaDeLasRecomendaciones(nombrePelicula) {
  const collection = db.collection('recomendaciones');
  const infoPelicula = await collection.findOne({ titulo: nombrePelicula })
  return infoPelicula;
}

async function borrarUsuario(nombreUsuario) {
  const collection = db.collection('Valoraciones');
  const infoPelicula = await collection.deleteOne({ usuario: nombreUsuario })
  return infoPelicula;
}




module.exports = { borrarDatosUsuario, borrarPerfil, obtenerLasCincoPeliculasMasNuevas, todasLasValoraciones, obtenerTodosLosNombresGeneros, obtenerTitulosPeliculasInfantiles, cambiarUsuarioEmailPerfil, obtenerTodaLaInformacionUsuario, analisisSentimiento, mostrarTodasLasValoraciones, cambiarContrasenna, comprobarnombreUsuario, registrarUsuario, comprobarUsuario, obtenerTodosLosComentarios, añadirNuevoComenatrio, añadirNuevaValoracion, obtenerGenerosPeliculasInfantiles, ObtenerPeliculasMasPopularesInfantiles, ObtenerPeliculasInfantiles, ObtenerPeliculasInfantilesSegunElGenero, ObtenerTituloGeneroDescripcionDeTodasPeliculas, ObtenerPeliculaDeLasRecomendaciones, ObtenerInformacionPeliculasRecomendaciones, comprobarExistenciausuario, agregarPeliculaListaPerfil, eliminarPeliculaListaPerfil, obtenerPerfilesDeUnUsuario, añadirNuevoPerfil, obtenerTitulosPeliculas, obtenerInfoPeliculasGenero, peliculasMasVistas, obtenerTodosLosGeneros, peliculaDetalles, obtenerNombreGenero, comprobarPeliculaLista, listaPeliculasUsuario };
