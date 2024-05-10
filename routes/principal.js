var express = require('express');
var router = express.Router();
var database = require('../consultasDB');
const session = require('express-session');


/* GET home page. */
router.get('/principal', async function (req, res, next) {

  const perfilCuenta = req.query.perfil;
  const usuarioCuenta = req.session.user;

    req.session.perfiles = perfilCuenta;
    req.session.usuario = usuarioCuenta;
  console.log('Valores de las variables de sesion son:  perfil:  ' 
  + req.session.perfiles + '  usuario: '+ req.session.usuario)
  const nombrePerfiles = await database.obtenerPerfilesDeUnUsuario(usuarioCuenta);
  const posicionPerfil = nombrePerfiles.indexOf(perfilCuenta);
  console.log('posicion del perfil ---------  '+nombrePerfiles.indexOf(perfilCuenta))


  try {
    
    console.log('valor de la pagina principaaaal   ' + perfilCuenta + usuarioCuenta )
    const genero = 'Aventura'
    const genero1 = 'Comedia'
    const peliculasPopulares = await database.peliculasMasVistas();
    const peliculas = await database.obtenerInfoPeliculasGenero('Aventura');
    const peliculasComedia = await database.obtenerInfoPeliculasGenero('Comedia');
   
    let html = '';
    let html1 = '';
    let html2 = '';
    let numeroRandom1 = 0;
    let numeroRandom2 = 0

    console.log('Longitud de peliculas populares  '+peliculasPopulares.length)
    
    html +='<h2> Peliculas más populares </h2>  <hr> <div class="box-container-1">';
    html1 +='<h2> '+ genero +' </h2>  <hr> <div class="box-container-2">';
    html2 +='<h2> '+ genero1 +' </h2>  <hr> <div class="box-container-3">';

    for (let i = 1; i <= 4; i++) {
         html += '<div class="box-1"><div class="content"><img class="imagenPelicula" src="https://image.tmdb.org/t/p/original'+ peliculasPopulares[i].poster_path +' " alt=""> '+
         '<h3>' + peliculasPopulares[i].title + '</h3> <a href="/peliculaDetallada?valor=' + peliculasPopulares[i].title +'"> ver mas </a>  </div>   </div>  '

         numeroRandom1 =  Math.floor(Math.random() * (peliculas.length - 1 + 1)) + 1;
         html1 += '<div class="box-2"><div class="content"><img class="imagenPelicula" src="https://image.tmdb.org/t/p/original'+ peliculas[numeroRandom1].poster_path +'"  alt=""> '+
         '<h3>' + peliculas[numeroRandom1].title + '</h3> <a href="/peliculaDetallada?valor=' + peliculas[numeroRandom1].title +'"> ver mas </a>  </div>   </div>  '

         numeroRandom2 =  Math.floor(Math.random() * (peliculasComedia.length - 1 + 1)) + 1;
         html2 += '<div class="box-3"><div class="content"><img class="imagenPelicula" src="https://image.tmdb.org/t/p/original'+ peliculasComedia[numeroRandom2].poster_path +'" alt=""> '+
         '<h3>' + peliculasComedia[numeroRandom2].title + '</h3> <a href="/peliculaDetallada?valor=' + peliculasComedia[numeroRandom2].title +'"> ver mas </a>  </div>   </div>  '
    }
    html += '</div>';
    html1 += '</div>';
    html2 += '</div>';



    res.render('principal', { html, html1, html2, perfilCuenta, usuarioCuenta, nombrePerfiles, posicionPerfil });

  } catch (error) {
    console.error('Error al consultar las películas:', error);
    // Aquí podrías enviar una respuesta de error si lo deseas
  }
});

router.get('/informacionListaPeliculasBuscador', async (req, res) => {
  try {

    const resultado =  await database.obtenerTitulosPeliculas();

    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener información:', error);
    res.status(500).json({ error: 'Error al obtener información' });
  }
});


module.exports = router;
