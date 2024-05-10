const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const { Console } = require('console');
const { generateKey } = require('crypto');


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


async function obtenerTodosLosGeneros() {
  const collection = db.collection('generos');
  const generos = await collection.find().toArray();
  return generos.map(genero => genero.name);
}


async function obtenerIDGenero(generos) {

  const collection = db.collection('generos');
  const query = Array.isArray(generos) ? { name: { $in: generos } } : { name: generos };
  const id_genero = await collection.find(query);
  const infoIDGenero = await id_genero.toArray();
  /*await infoIDGenero.forEach(document => {
    if (!nombresSet.has(document.id)) {
      nombresSet.add(document.id);
    }
  });
  return Array.from(nombresSet);*/
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
  const peliculasPopulares = await collection.find().sort({ popularity: -1 });
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

async function listaPeliculasUsuario(nombre, perfil) {
  const collection = db.collection('Users');
  const usuario = await collection.findOne({ nombre: nombre});

  if (usuario) {
    let perfiluser;
    for (let i = 0; i < usuario.perfiles.length; i++) {
      if(usuario.perfiles[i].nombre === perfil){
        perfiluser = usuario.perfiles[i];
        break;
      }
    }
    if(perfiluser){
      const peliculasPerfil = perfiluser.peliculas;
      return peliculasPerfil || [];
    }
  } else {
    console.log("Usuario no encontrado o el perfil  no está asociado al usuario.");
  }
}

async function obtenerTitulosPeliculas() {
  const collection = db.collection('peliculas');
  const tituloPeliculas = await collection.find().toArray();
  return tituloPeliculas.map(genero => genero.title);

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
        { _id: usuarioID,
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
      { _id: usuarioID,
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
/*
comprobarExistenciausuario('maria')
.then(resultado => {
  console.log('Resultado:', resultado);
})
.catch(error => {
  console.error('Error al obtener información de películas:', error);
});*/
/*
eliminarPeliculaListaPerfil('maria', 'maria', 'Wonka')
.then(resultado => {
  console.log('Resultado:', resultado);
})
.catch(error => {
  console.error('Error al obtener información de películas:', error);
});
/*
añadirPeliculaListaPerfil('maria', 'maria', 'Wonka')
.then(resultado => {
  console.log('Resultado:', resultado);
})
.catch(error => {
  console.error('Error al obtener información de películas:', error);
});

/*
comprobarPeliculaLista('maria', 'maria', 'Kung Fu Panda 4')
.then(resultado => {
  console.log('Resultado:', resultado);
})
.catch(error => {
  console.error('Error al obtener información de películas:', error);
});

/*obtenerPerfilesDeUnUsuario('maria')
  .then(resultado => {
    console.log('Resultado:', resultado);
  })
  .catch(error => {
    console.error('Error al obtener información de películas:', error);
  });

/*
obtenerIDUsuario('maria')
  .then(resultado => {
    console.log('Resultado:', resultado);
  })
  .catch(error => {
    console.error('Error al obtener información de películas:', error);
  });


añadirNuevoPerfil('maria', 'julia')
  .then(resultado => {
    console.log('Resultado:', resultado);
  })
  .catch(error => {
    console.error('Error al obtener información de películas:', error);
  });


peliculaDetalles('Kung Fu Panda 4')
  .then(resultado => {
    console.log('Resultado:', resultado.title);
  })
  .catch(error => {
    console.error('Error al obtener información de películas:', error);
  });

/*
listaPeliculasUsuario('maria','mar')
  .then(resultado => {
    console.log('Resultado:', resultado);
  })
  .catch(error => {
    console.error('Error al obtener información de películas:', error);
  });


/*comprobarPeliuclaLista('lucia', 'Godzilla y Kong: El nuevo imperio')
  .then(resultado => {
    console.log('Resultado: g', resultado);
  })
  .catch(error => {
    console.error('Error al obtener información de películas:', error);
  });

  comprobarPeliuclaLista('lucia', 'Road House (De profesión: duro)')
  .then(resultado => {
    console.log('Resultado:', resultado);
  })
  .catch(error => {
    console.error('Error al obtener información de películas:', error);
  });*/

/* obtenerTitulosPeliculas()
.then(resultado => {
 console.log('Resultadooo Peluclas titulo:', resultado);
})
.catch(error => {
 console.error('Error al obtener información de películas:', error);
});*/


/*obtenerNombreGenero([12,16,16])
  .then(resultado => {
    console.log('Resultado:', resultado);
  })
  .catch(error => {
    console.error('Error al obtener información de películas:', error);
  });*/
/*
  obtenerInfoPeliculasGenero('Aventura')
  .then(resultado => {
    console.log('Resultado:', resultado);
  })
  .catch(error => {
    console.error('Error al obtener información de películas:', error);
  });*/

/*peliculasMasVistas()
.then(resultado => {
  console.log('Resultado:', resultado);
})
.catch(error => {
  console.error('Error al obtener información de películas:', error);
});*/


module.exports = { comprobarExistenciausuario, agregarPeliculaListaPerfil, eliminarPeliculaListaPerfil,  obtenerPerfilesDeUnUsuario, añadirNuevoPerfil, obtenerTitulosPeliculas, obtenerInfoPeliculasGenero, peliculasMasVistas, obtenerTodosLosGeneros, peliculaDetalles, obtenerNombreGenero, comprobarPeliculaLista, listaPeliculasUsuario };
//export { obtenerInfoPeliculasGenero, peliculasMasVistas};
