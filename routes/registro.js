var express = require('express');
var router = express.Router();
const { request } = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const cookieParser = require('cookie-parser');


const dbURI = 'mongodb://127.0.0.1:27017/Series';
const dbName = 'Series'
const client = new MongoClient(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = client.db(dbName);

/* GET home page. */
router.get('/registro', function (req, res, next) {

  res.render('registro', { title: 'Catalago' });
});



router.post("/registro", function (req, res, next) {

  console.log('ESTOY EN EL POST DEL REGISTRO')
  let name = req.session.name = req.body.usernameRegistro;
  let pass = req.session.pass = req.body.passwordRegistro;
  let email = req.session.email = req.body.emailRegistro;

  let campoError = req.session.campoError = "";

  let errores = validarDatos(name, pass, email);
  console.log('AQUIIIIIIII    ')
  if (errores[0]) {
    req.session.error = errores[1];
    res.redirect("/registro");
  }
  else {
    async function insertarUsuario() {
      let mensajeError = "";
      const collection = db.collection('Users');
      const resultado = await collection.insertOne({
        nombre: name,
        contraseña: pass,
        email: email,
        perfiles: [
            {nombre: name, iconUser: '/images/userIcon.png', peliculas: []},
            {nombre: 'Kids', iconUser: '/images/userIconKids.png', peliculas: []}
          ]
      });

      console.log(Object.keys(resultado).length)
      console.log(resultado)
      if (Object.keys(resultado).length > 0) {
        delete req.session.name;
        delete req.session.pass;
        delete req.session.email;
        res.cookie('mensaje', 'block');
        res.redirect('/');
      }
      else {
        req.session.error = mensajeError;
        req.session.campoError = campoError;
        res.redirect("/registro");
      }
    }
    insertarUsuario();
  }

});


function validarDatos(name, pass, email) {
  let error = false;
  let textoError = "";
  var patronCorreo = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
  var patronContrasenna = /(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;

  if (name.length === 0) {
    textoError += "El nombre está vacío</br>";
  }
  if (email.length != 0 && !patronCorreo.test(email)) {
    textoError += "El formato de correo es incorrecto</br>";
  }
  if (pass.length === 0) {
    textoError += "La contraseña está vacía</br>";
  }
  else if (!patronContrasenna.test(pass)) {
    textoError += "La contraseña no cumple el patrón</br>";
  }
  if (textoError != "") {
    error = true;
  }

  return [error, textoError];
}


module.exports = router;
