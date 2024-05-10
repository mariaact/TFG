const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');


const dbURI = 'mongodb://127.0.0.1:27017/Series';
const apiKey = "7550c4f2e2a2e5f83baa7235c0426643";
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


/**/

async function verificarYEliminarColeccion(nombreColeccion) {
  const colecciones = await db.listCollections().toArray();
  const existeColeccion = colecciones.some(c => c.name === nombreColeccion);

  if (existeColeccion) {
    await db.collection(nombreColeccion).drop();
    console.log(`La colección ${nombreColeccion} ha sido eliminada`);
  } else {
    console.log(`La colección ${nombreColeccion} no existe`);
  }
}

const collectionNameSchema = new mongoose.Schema({
  id: Number,
  name: String,
});
const Genero = mongoose.model('Generos', collectionNameSchema);

async function guardarGenerosBaseDeDatos() {
  try {

    await verificarYEliminarColeccion('Generos');

    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=es`
    const response =  await fetch(url);

    if (!response.ok) {
      throw new Error('Error al obtener datos de la API');
    }

    const data = await response.json();
    const generosInfo = data.genres;
        
    const resultado = await Genero.insertMany(generosInfo, { ordered: false });
     
    console.log('Datos añadidos correctamente a la colección');
    mongoose.connection.close();

  } catch (error) {
    console.log('Error al agregar datos a la colección:', error);
  }


}

//guardarGenerosBaseDeDatos();


async function obtenerTodasLasPeliculas() {
  let pagina = 1;
  let todasLasPeliculas = [];

  try {
    while (true) {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=7550c4f2e2a2e5f83baa7235c0426643&language=es&page=${pagina}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al realizar la solicitud a la API');
      }

      const data = await response.json();
      const peliculas = data.results;

      // Agregar las películas de la página actual a todasLasPeliculas
      todasLasPeliculas = todasLasPeliculas.concat(peliculas);

      // Si no hay más páginas, salir del bucle
      if (pagina >= 500) {
        break;
      }

      // Ir a la siguiente página
      pagina++;
    }

    console.log('Todas las películas obtenidas:', todasLasPeliculas.length);
    return todasLasPeliculas;
  } catch (error) {
    console.error('Error al obtener todas las películas:', error);
    return null;
  }
}

// Llamar a la función para obtener todas las películas
//obtenerTodasLasPeliculas();




const peliculasSchema = new mongoose.Schema({
  adult: Boolean,
  backdrop_path: String,
  genre_ids: [Number],
  id: { type: Number, required: true },
  original_language: String,
  original_title: String,
  overview: String,
  popularity: Number,
  poster_path: String,
  release_date: String,
  title: { type: String, required: true },
  video: Boolean,
  vote_average: Number,
  vote_count: Number
});

const Pelicula = mongoose.model('Peliculas', peliculasSchema);

async function guardarPeliculasBaseDeDatos() {
  try {
    await verificarYEliminarColeccion('Peliculas');

    const peliculas = await obtenerTodasLasPeliculas();

    for (const pelicula of peliculas) {
      const existente = await Pelicula.exists({ title: pelicula.title });

      if (!existente) {
        await Pelicula.create(pelicula);
        // console.log(`Película "${pelicula.title}" añadida correctamente`);
      } else {
        //console.log(`La película "${pelicula.title}" ya existe en la base de datos. No se insertará nuevamente.`);
      }
    }

    console.log('Proceso de inserción completado');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error al agregar datos a la colección:', error);
  }
}


const axios = require('axios');


async function obtenerInfoPelicula(movieId) {
  try {
    const url = `https://api.themoviedb.org/3/movie/550?api_key=7550c4f2e2a2e5f83baa7235c0426643&language=en-US&append_to_response=credits`;
    const response = await axios.get(url);
    const { data } = response;

    // Extraer los datos relevantes
    const reparto = data.credits.cast.map(actor => actor.name);
    const duracion = data.runtime;
    
    return { reparto, duracion };
  } catch (error) {
    console.error(`Error al obtener información de la película ${movieId} desde TMDb:`, error);
    throw error;
  }
}

async function actualizarInfoPeliculas() {


  try {
    await client.connect();

    const collection = db.collection('peliculas');

    const peliculas = await collection.find().toArray();

    for (const pelicula of peliculas) {
      const { _id: movieId } = pelicula;

      const { reparto, duracion } = await obtenerInfoPelicula(movieId);

      await collection.updateOne(
        { _id: movieId },
        { $set: { reparto, duracion } }
      );

      console.log(`Información de la película ${movieId} actualizada correctamente.`);
    }

    console.log('Todas las películas han sido actualizadas correctamente.');
  } catch (error) {
    console.error('Error al actualizar la información de las películas en MongoDB:', error);
  } finally {
    await client.close();
  }
}

















async function ejecutarMetodosIndependientes() {
  console.log('Iniciando Método 1');
  const guardarPeliculasPromise = actualizarInfoPeliculas(); // Ejecutar guardarPeliculasBaseDeDatos sin esperar
  await guardarPeliculasPromise; // Esperar a que se resuelva la promesa de guardarPeliculasBaseDeDatos
  console.log('Iniciando Método 1');
 /* const guardarPeliculasPromise1 = guardarGenerosBaseDeDatos(); // Ejecutar guardarPeliculasBaseDeDatos sin esperar
  await guardarPeliculasPromise1; // Esperar a que se resuelva la promesa de guardarPeliculasBaseDeDatos
  console.log('TERMINADA LA CARGA')*/
}

ejecutarMetodosIndependientes();


/*
function informacionGeneros() {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=es`
  fetch(url)
    .then(response => response.json())
    .then(data => {
      return data.genres
    })
    .catch(error => {
      console.error('Error al obtener la información de los generos:', error);
    });
}


/*function informacionPeliculas() {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es`;

  // Retornar la promesa devuelta por fetch
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      // Información sobre las películas descubiertas
      const peliculas = data.results;
      return peliculas;
    })
    .catch(error => {
      console.error('Error al obtener la información de las películas:', error);
      throw error; // Rechazar la promesa con el error
    });
}*/



//module.exports = { obtenerTodasLasPeliculas, obtenerInfoPeliculasGenero };



