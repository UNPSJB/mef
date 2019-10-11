var express = require('express');
var router = express.Router();
var accountService = require("../services/account");
var userService = require("../services/user");
var rolService = require("../services/rol");
var permisos = require('../auth/permisos');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.userId);
  console.log(req.session.rol);
  req.flash('success', 'Link agregado correctamente');  
  res.render('home',{layout:'second'});
});

router.get('/login', permisos.redirectHome,(req, res) => {
  res.render('login',{layout:'second'});
});

router.get('/register', permisos.redirectHome, (req, res) => {
  res.render('register',{layout:'second'});
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  accountService.auth(email, password)
    .then(user => {req.session.userId = 5;
      if( !user) {
        res.render('login', {layout:'second', error: "email y/o contrasena incorrectos!", email});
      }
      if (user) {
        console.log(user);
        req.session.userId = user.id;
        // req.session.rol = user.Rol.descripcion || 'taller'; //viene de la DB @profe
        req.session.rol = 'taller'; //viene de la DB @profe
        res.redirect('/');
        //decidir como asignar roles, @profe
      }
    });
});

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  userService.createUser(email, password )
  .then(() => {
    res.render("info", {layout:'second',exito:true, mensaje:"Usuario creado exitosamente!"});
  })
  .catch( (e) => {
    res.render("info", {layout:'second',exito:false, mensaje: `Usuario no pudo ser creado: ${e}`})
  });
  //@TODO redireccionar a una pagina de no pudo ser creado o algo asi
});

module.exports = router;
