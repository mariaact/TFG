var express = require('express');
var router = express.Router();
const { request } = require('express');



/* GET home page. */
router.get('/', function (req, res, next) {

  const mensaje = req.cookies.mensaje || 'none';
  console.log(mensaje)

   // res.clearCookie('mensaje');



  res.render('logIn', { title: 'Catalago', mensaje: mensaje });
});

router.post('/logIn', function (req, res, next) {
  // se obtienen los datos del formulario
  let usr = req.body.username;
  let pwd = req.body.password;

  req.session.user = usr;

  if (usr && pwd) {
    res.redirect("/paginaUsuarios");
  }else{
    res.render('logIn',  { title: 'Catalago', mensaje: mensaje })
  }


});


module.exports = router;
