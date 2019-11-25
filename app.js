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
var dinosauriosRouter = require('./routes/dinosaurios');
var fosilesRouter = require('./routes/fosiles');
var subclaseRouter = require('./routes/subclases');
var replicasRouter = require('./routes/replicas');
var clientesRouter = require('./routes/clientes');
var clientesRouter = require('./routes/clientes');
var empleadosRouter = require('./routes/empleados');

var app = express();

// view engine setup
app.engine('hbs', hbs({defaultLayout:'main', extname:'.hbs'}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser())
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
  })
);

app.use('/', indexRouter); // esta planteado dentro del router 
app.use('/dinosaurios', permisos.estaLogueado, dinosauriosRouter);
app.use('/fosiles', permisos.estaLogueado, fosilesRouter); /// solo coleccion
app.use('/subclases', 
  permisos.estaLogueado, 
  permisos.permisoPara([permisos.ROLES.COLECCION]), 
  subclaseRouter); /// solo coleccion
app.use('/clientes', permisos.estaLogueado, clientesRouter);
app.use('/empleados', permisos.estaLogueado, empleadosRouter);
app.use('/replicas', permisos.estaLogueado, replicasRouter);

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

app.sequelizeSessionStore = SequelizeStore;
module.exports = app;

//app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));