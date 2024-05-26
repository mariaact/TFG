var express = require('express');
var router = express.Router();
var database = require('../consultasDB');
var recomendacionesUser = require('../recomendacionesUsuario');
const { compare } = require('bcrypt');
const { library } = require('webpack');

/* GET home page. */
router.get('/principal', async function (req, res, next) {

  const perfilCuenta = req.query.perfil;
  const usuarioCuenta = req.session.user;
  let lista = '';

  console.log('usuario   ' + perfilCuenta + usuarioCuenta)

  req.session.perfiles = perfilCuenta;
  req.session.usuario = usuarioCuenta;
  const nombrePerfiles = await database.obtenerPerfilesDeUnUsuario(usuarioCuenta);
  const posicionPerfil = nombrePerfiles.indexOf(perfilCuenta);


  try {

    const genero = 'Aventura'
    const genero1 = 'Comedia'
    const peliculasPopulares = await database.peliculasMasVistas();
    const peliculas = await database.obtenerInfoPeliculasGenero(genero);
    const peliculasComedia = await database.obtenerInfoPeliculasGenero(genero1);
    const peliculasPopularesInfantiles = await database.ObtenerPeliculasMasPopularesInfantiles();
    const peliculasInfantilesGenero = await database.ObtenerPeliculasInfantilesSegunElGenero(genero);
    const peliculasComediaInfantiles = await database.ObtenerPeliculasInfantilesSegunElGenero(genero1);



    const infoPeliculasMasVistas = JSON.stringify(peliculasPopulares);
    const infoPeliculasAventura = JSON.stringify(peliculas);
    const infoPeliculasComedia = JSON.stringify(peliculasComedia);


    const infoPeliculasMasVistasInfantiles = JSON.stringify(peliculasPopularesInfantiles);
    const infoPeliculasAventuraInfantiles = JSON.stringify(peliculasInfantilesGenero);
    const infoPeliculasComediaInfantiles = JSON.stringify(peliculasComediaInfantiles);

    //const infoPeliculasQueQuizasTeGusten = (infoPeliculasQueQuizasTeGusten1);
    let infoPeliculasQueQuizasTeGusten = '';
    let peliculasQueQuizasTeGusten = '';
    if(perfilCuenta != 'Kids'){
      lista = await database.listaPeliculasUsuario(usuarioCuenta, perfilCuenta);
      console.log('------------------------------------------------ ' + lista.length)
      if(lista.length != 0){
        peliculasQueQuizasTeGusten = await recomendacionesUser.principal(perfilCuenta);
        console.log('recomendaciones: ' + peliculasQueQuizasTeGusten)
        console.log(peliculasQueQuizasTeGusten[1].titulo)
        console.log(peliculasQueQuizasTeGusten.length)
        infoPeliculasQueQuizasTeGusten = JSON.stringify(peliculasQueQuizasTeGusten);
    
      }
      
    }
  

    let html0 = ''
    let html = '';
    let html1 = '';
    let html2 = '';
    let numeroRandom1 = 0;
    let numeroRandom2 = 0
    let idCont = 1;
    

    html += '<h2> Peliculas más populares </h2>  <hr> <div class="box-container-1">';
    html1 += '<h2> ' + genero + ' </h2>  <hr> <div class="box-container-2">';
    html2 += '<h2> ' + genero1 + ' </h2>  <hr> <div class="box-container-3">';

    if (req.session.perfiles == 'Kids') {

      for (let i = 0; i < 4; i++) {


        html += '<div class="box-1"><div class="content"><img class="imagenPelicula" id="img1-'+idCont+'" src="https://image.tmdb.org/t/p/original' + peliculasPopularesInfantiles[i].poster_path + ' " alt=""> ' +
          '<h3 id="h31-'+idCont+'">' + peliculasPopularesInfantiles[i].title + '</h3> <a id="enlacePelicula1-'+idCont+'" href="/peliculaDetallada?valor=' + peliculasPopularesInfantiles[i].title + '"> ver mas </a>  </div>   </div>  '

        numeroRandom1 = Math.floor(Math.random() * (peliculasInfantilesGenero.length - 1 + 1)) + 1;
        html1 += '<div class="box-2"><div class="content"><img class="imagenPelicula" id="img2-'+idCont+'" src="https://image.tmdb.org/t/p/original' + peliculasInfantilesGenero[numeroRandom1].poster_path + '"  alt=""> ' +
          '<h3 id="h32-'+idCont+'">' + peliculasInfantilesGenero[numeroRandom1].title + '</h3> <a id="enlacePelicula2-'+idCont+'" href="/peliculaDetallada?valor=' + peliculasInfantilesGenero[numeroRandom1].title + '"> ver mas </a>  </div>   </div>  '

        numeroRandom2 = Math.floor(Math.random() * (peliculasComediaInfantiles.length - 1 + 1)) + 1;
        html2 += '<div class="box-3"><div class="content"><img class="imagenPelicula" id="img3-'+idCont+'" src="https://image.tmdb.org/t/p/original' + peliculasComediaInfantiles[numeroRandom2].poster_path + '" alt=""> ' +
          '<h3 id="h33-'+idCont+'">' + peliculasComediaInfantiles[numeroRandom2].title + '</h3> <a id="enlacePelicula3-'+idCont+'" href="/peliculaDetallada?valor=' + peliculasComediaInfantiles[numeroRandom2].title + '"> ver mas </a>  </div>   </div>  '
          idCont++;
      }
    } else {

      if(lista.length != 0){
        html0 += '<h2> Peliculas que quizás te gusten </h2>  <hr> <div class="box-container-1">';
      }
      for (let i = 0; i < 4; i++) {

        console.log(peliculas.length + '   ****   ' + peliculasComedia.length)
        if(lista.length != 0){
          html0 += '<div class="box-1"><div class="content"><img class="imagenPelicula" id="img1-'+idCont+'" src="https://image.tmdb.org/t/p/original' + peliculasQueQuizasTeGusten[i].imagen + ' " alt=""> ' +
          '<h3 id="h31-'+idCont+'">' + peliculasQueQuizasTeGusten[i].titulo + '</h3> <a id="enlacePelicula1-'+idCont+'" href="/peliculaDetallada?valor=' + peliculasQueQuizasTeGusten[i].titulo + '"> ver mas </a>  </div>   </div>  '  
        }
       
        html += '<div class="box-1"><div class="content"><img class="imagenPelicula" id="img1-'+idCont+'" src="https://image.tmdb.org/t/p/original' + peliculasPopulares[i].poster_path + ' " alt=""> ' +
          '<h3 id="h31-'+idCont+'">' + peliculasPopulares[i].title + '</h3> <a id="enlacePelicula1-'+idCont+'" href="/peliculaDetallada?valor=' + peliculasPopulares[i].title + '"> ver mas </a>  </div>   </div>  '

        numeroRandom1 = Math.floor(Math.random() * (peliculas.length - 1 + 1)) + 1;
        html1 += '<div class="box-2"><div class="content"><img class="imagenPelicula" id="img2-'+idCont+'" src="https://image.tmdb.org/t/p/original' + peliculas[numeroRandom1].poster_path + '"  alt=""> ' +
          '<h3 id="h32-'+idCont+'">' + peliculas[numeroRandom1].title + '</h3> <a id="enlacePelicula2-'+idCont+'" href="/peliculaDetallada?valor=' + peliculas[numeroRandom1].title + '"> ver mas </a>  </div>   </div>  '

        numeroRandom2 = Math.floor(Math.random() * (peliculasComedia.length - 1 + 1)) + 1;
        html2 += '<div class="box-3"><div class="content"><img class="imagenPelicula" id="img3-'+idCont+'" src="https://image.tmdb.org/t/p/original' + peliculasComedia[numeroRandom2].poster_path + '" alt=""> ' +
          '<h3 id="h33-'+idCont+'">' + peliculasComedia[numeroRandom2].title + '</h3> <a id="enlacePelicula3-'+idCont+'" href="/peliculaDetallada?valor=' + peliculasComedia[numeroRandom2].title + '"> ver mas </a>  </div>   </div>  '
          idCont++;
      }
    }

    html0 += '</div>';
    html += '</div>';
    html1 += '</div>';
    html2 += '</div>';

  lista = lista.length;
  res.render('principal', { lista, html0, html, html1, html2, perfilCuenta, usuarioCuenta, nombrePerfiles, posicionPerfil, infoPeliculasMasVistas, infoPeliculasAventura, infoPeliculasComedia, infoPeliculasMasVistasInfantiles, infoPeliculasAventuraInfantiles, infoPeliculasComediaInfantiles, infoPeliculasQueQuizasTeGusten});

  } catch (error) {
    console.error('Error al consultar las películas:', error);
  }
});

router.get('/informacionListaPeliculasBuscador', async (req, res) => {
  try {

    let resultado = '';
    if(req.session.perfiles == 'Kids'){
      console.log('buscador kids')
      resultado = await database.obtenerTitulosPeliculasInfantiles();

    }else{
      console.log('buscador normal')
      resultado = await database.obtenerTitulosPeliculas();
    }

    console.log(resultado)
    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener información:', error);
    res.status(500).json({ error: 'Error al obtener información' });
  }
});


module.exports = router;
