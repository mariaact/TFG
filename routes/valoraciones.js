var express = require('express');
var router = express.Router();
var database = require('../consultasDB');


/* GET users listing. */
router.get('/valoraciones', async function (req, res, next) {
  const pelicula = req.query.titulo;
  const usuario = req.session.usuario;
  const perfil = req.session.perfiles;
  const nombrePerfiles = await database.obtenerPerfilesDeUnUsuario(req.session.usuario);
  const posicionPerfil = nombrePerfiles.indexOf(req.session.perfiles);

  let html = ''

  const datosChat = await database.obtenerTodosLosComentarios(pelicula)
  .then(async resultado => {
  console.log('Resultado:', resultado);

  if(resultado.length == 0){
    html = '<h1 class="vacio">Se el primero en añadir una valoración a la película '+pelicula+'</h1>';
      }
    for(let i = 0; i< resultado.length; i++){
      console.log(usuario)
      const nombrePerfiles = await database.obtenerPerfilesDeUnUsuario(resultado[i].usuario);
      console.log(nombrePerfiles)
      console.log(nombrePerfiles.indexOf(resultado[i].nombrePerfil))
      let color = '';
      if(nombrePerfiles.indexOf(resultado[i].nombrePerfil) == 0){
        color = 'icon1';
      }else if(nombrePerfiles.indexOf(resultado[i].nombrePerfil) == 2){
        color = 'icon2';
      }else if(nombrePerfiles.indexOf(resultado[i].nombrePerfil) == 3){
        color = 'icon3';
      }
      console.log(color)
      html += '<div class="itemCrit" data-id="1403"><div class="headCri canReply" style="padding: 1.3vh 1.3vh 1.3vh 1.3vh;">'
      + '<div class="uAvatar"><img id="'+color+'" class="iconUser" src="/images/userIcon.png"></div><a href="javascript:void(0)">'+resultado[i].nombrePerfil +' [ '+resultado[i].usuario+' ]</a>'
      + '<p class="dateContainer"></p></div> <div class="cuerCri canReply">'+resultado[i].comentario+'</div></div>'
    }
  })

 

  res.render('valoraciones', {  pelicula, html, perfil, usuario, posicionPerfil });
});

router.post('/valoraciones', async function (req, res, next) {
  const pelicula = req.query.titulo;
  const valoracion = req.body.textoValoracion;
  const usuario = req.session.usuario;
  const perfil = req.session.perfiles;
  let html = '';
  const nombrePerfiles = await database.obtenerPerfilesDeUnUsuario(req.session.usuario);
  const posicionPerfil = nombrePerfiles.indexOf(req.session.perfiles); 



  await database.añadirNuevoComenatrio(pelicula, valoracion, usuario, perfil);

  const datosChat = await database.obtenerTodosLosComentarios(pelicula)
  .then(async resultado => {
  console.log('Resultado:', resultado);
    for(let i = 0; i< resultado.length; i++){
      const nombrePerfiles = await database.obtenerPerfilesDeUnUsuario(usuario);
      console.log(nombrePerfiles.indexOf(resultado[i].nombrePerfil))
      let color = '';
      if(nombrePerfiles.indexOf(resultado[i].nombrePerfil) == 0){
        color = 'box1';
      }else if(nombrePerfiles.indexOf(resultado[i].nombrePerfil) == 2){
        color = 'box2';
      }else if(nombrePerfiles.indexOf(resultado[i].nombrePerfil) == 3){
        color = 'box3';
      }
      console.log(color)
      html += '<div class="itemCrit" data-id="1403"><div class="headCri canReply" style="padding: 1.3vh 1.3vh 1.3vh 1.3vh;">'
      + '<div class="uAvatar"><img id="'+color+'" class="iconUser" src="/images/userIcon.png"></div><a href="javascript:void(0)">'+resultado[i].nombrePerfil +' [ '+resultado[i].usuario+' ]</a>'
      + '<p class="dateContainer"></p></div> <div class="cuerCri canReply">'+resultado[i].comentario+'</div></div>'
    }
  })

  res.render('valoraciones', { pelicula, html, perfil, usuario, posicionPerfil});
});

/*
app.post('/valoraciones', (req, res) => {
    console.log('Request Body:', req.body);
    const valoracion = req.body.textoValoracion;
    console.log('Valoración guardada:', valoracion);
    res.redirect('/valoraciones');
});

*/

module.exports = router;
