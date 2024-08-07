var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const cors = require('cors');

var administracionUsuarios = require('./routes/configuracion')
var indexRouter = require('./routes/logIn');
var registroRouter = require('./routes/registro');
var cambiarContrasennaRouter = require('./routes/modificarUsuario');
var peliculaDetallesRouter = require('./routes/peliculaDetallada');
var peliculasRouter = require('./routes/catalogo');
var principalRouter = require('./routes/principal');
var usersRouter = require('./routes/users');
var listaUserRouter = require('./routes/lista');
var usuariosRouter = require('./routes/paginaUsuarios');
var valoracionesRouter = require('./routes/valoraciones');


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'El secreto que queramos nosotros'
}));

app.use(function(req, res, next){
  let error = req.session.error;
  let message = req.session.message;
  delete req.session.error;
  delete req.session.message;
  res.locals.error = "";
  res.locals.message = "";
  if (error) res.locals.error = `<p>${error}</p>`;
  if (message) res.locals.message = `<p>${message}</p>`;
  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Permite todas las fuentes, puedes restringir a tu dominio específico
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/', indexRouter);
app.use('/', administracionUsuarios);
app.use('/', registroRouter);
app.use('/', cambiarContrasennaRouter);
app.use('/', peliculaDetallesRouter);
app.use('/', peliculasRouter);
app.use('/', principalRouter);
app.use('/', listaUserRouter);
app.use('/', usuariosRouter);
app.use('/', valoracionesRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
