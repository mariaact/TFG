var express = require('express');
var router = express.Router();
var database = require('../consultasDB');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const { use } = require('./catalogo');

const dbURI = 'mongodb://127.0.0.1:27017/Series';
const dbName = 'Series'
const client = new MongoClient(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = client.db(dbName);

/* GET home page. */
router.get('/peliculaDetallada', async function (req, res, next) {

  console.log('Valores de las variables de sesion son:  perfil:  ' 
  + req.session.perfiles + '  usuario: '+ req.session.usuario)
  const nombrePelicula = req.query.valor;
  const perfil = req.session.perfiles
  const user = req.session.usuario
  const nombrePerfiles = await database.obtenerPerfilesDeUnUsuario(user);
  const posicionPerfil = nombrePerfiles.indexOf(perfil);

  console.log('valores de la sesion   ------  ' + perfil + user)

  
  const peliculaDetalles = await database.peliculaDetalles(nombrePelicula);

  const titulo = peliculaDetalles.title;
  const fechaLanzamiento = new Date(peliculaDetalles.release_date).getFullYear();
  const review = peliculaDetalles.overview;
  const foto = peliculaDetalles.backdrop_path;
  const duracion = peliculaDetalles.duracion;
  const reparto = peliculaDetalles.reparto.slice(0, 10);;
  const imageUrl = 'https://image.tmdb.org/t/p/original' + foto;
  const generos = await database.obtenerNombreGenero(peliculaDetalles.genre_ids);
  const pelicula = titulo;
  const comprobarPeliculaLista = await database.comprobarPeliculaLista(user, perfil, titulo);

  res.render('peliculaDetallada', { titulo, fechaLanzamiento, duracion, review, imageUrl, reparto, generos, pelicula, user, comprobarPeliculaLista, perfil, posicionPerfil });
});

router.use(bodyParser.json());

router.post('/enviar-datos', async (req, res) => {
  const nombreUsuario = req.body.Usuario;
  const pelicula = req.body.Pelicula;
  const perfil = req.body.Perfil;
  console.log('valor del corazon en la peli:   ' + req.body.Corazon)
  console.log('valores en la peli:   ' + nombreUsuario + pelicula + perfil)


  const peliculaDetalles = await database.peliculaDetalles(req.body.Pelicula);
  const fechaLanzamiento = new Date(peliculaDetalles.release_date).getFullYear();
  const review = peliculaDetalles.overview;
  const foto = peliculaDetalles.backdrop_path;
  const duracion = peliculaDetalles.duracion;
  const reparto = peliculaDetalles.reparto.slice(0, 10);;
  const imageUrl = 'https://image.tmdb.org/t/p/original' + foto;
  const generos = await database.obtenerNombreGenero(peliculaDetalles.genre_ids);
  /*const nombreUsuario = req.body.Usuario;
  const pelicula = req.body.Pelicula;
  const perfil = req.body.Perfil;*/
  console.log('comprobacion ' + nombreUsuario + perfil + pelicula)
  const comprobarPeliculaLista = await database.comprobarPeliculaLista(nombreUsuario, perfil, pelicula);
  console.log(comprobarPeliculaLista)
  try {


    console.log('valor del corazon en la peli:   ' + req.body.Corazon)

    //eliminar la pelicula
    if (req.body.Corazon === false) {
      console.log('estoy es enviar-datooosss   if')
      const usuario = await database.comprobarExistenciausuario(nombreUsuario);
      console.log(usuario)
      console.log(comprobarPeliculaLista)
      if (usuario && comprobarPeliculaLista) {
        console.log('dentro del if grande')
        const result = await database.eliminarPeliculaListaPerfil(nombreUsuario, perfil, pelicula)
        console.log(result)
        console.log('ha entrado en eliminar')
        /*if (result.modifiedCount === 1) {
          res.status(200).json({ message: 'Película borrada correctamente' });
        } else {
          res.status(404).json({ message: 'Película no encontrada en el array' });
        }*/
      } else {
        res.status(404).json({ message: 'Usuario no encontrado o película no presente en el array' });
      }

    } else {
      console.log('estoy es enviar-datooosss   else')
      console.log(nombreUsuario)
      const usuario = await database.comprobarExistenciausuario(nombreUsuario);
      console.log(usuario)
      if (usuario) {
        console.log('demtro if usuario')
        const result = await database.agregarPeliculaListaPerfil(nombreUsuario, perfil, pelicula)
        /* if (result.modifiedCount === 1) {
           res.status(200).json({ message: 'Película borrada correctamente' });
         } else {
           res.status(404).json({ message: 'Película no encontrada en el array' });
         }
       } else {
         res.status(404).json({ message: 'Usuario no encontrado o película no presente en el array' });
       */ }
    }
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
  //res.render('peliculaDetalles', { pelicula, fechaLanzamiento, duracion, review, imageUrl, reparto, generos, pelicula, user, comprobarPeliculaLista, perfil });

});

module.exports = router;
