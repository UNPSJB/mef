var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var methodOverride = require('method-override');
var session = require('express-session');
var cookieParser = require('cookie-parser'); // sequelize store dependencia
var database = require('./models');
var permisos = require('./auth/permisos');


//rutas
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dinosauriosRouter = require('./routes/dinosaurios');
//var fosilesRouter = require('./routes/fosiles');
var subclaseRouter = require('./routes/subclases');

//primer paso declarar la ruta para los clientes
var clientesRouter = require('./routes/clientes');
var empleadosRouter = require('./routes/empleados');

var app = express();

// view engine setup
app.engine('hbs', hbs({defaultLayout:'main', extname:'.hbs'}));
// app.set('views', './views');
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser())
// ALEX ESTUVO ACA
app.use(session({
  secret: 'lexpgnodesession',
  resave: false,
  saveUninitialized: false
}));


app.use(methodOverride('_method'));

var SequelizeStore = require('connect-session-sequelize')(session.Store);

app.use(session({
  store: new SequelizeStore({
    db: database.sequelize
  }),
  name: process.SESS_NAME,
  saveUninitialized:false,
  resave:false,
  secret: process.env.SESS_SECRET,
  cookie: {
    maxAge:1000*60*60*3, //3 horas
    sameSite: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));


// Arranca la magia
// app.use((req, res, next) => (req.path.startsWith('/login') || req.path.startsWith('/register') || req.session.userId) ? next() : res.redirect('/login'));

app.use('/', indexRouter); /// a este no se le pone pq tiene register y login adentro
app.use('/users', permisos.estaLogueado, usersRouter);
app.use('/dinosaurios', dinosauriosRouter);
//app.use('/fosiles', permisos.estaLogueado, fosilesRouter);
app.use('/subclases',permisos.estaLogueado, subclaseRouter);
//segundo paso indicarle a la aplicacion que para rutas con /clientes el midware de cliente resolvera la peticion
app.use('/clientes',clientesRouter);
app.use('/empleados',empleadosRouter);

// app.use('/login');
// app.use('/register');
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

// ALEX ESTUVO ACA 
// Global Variables
app.use((req, res, next) => {
  next();
});



app.sequelizeSessionStore = SequelizeStore;
module.exports = app;
