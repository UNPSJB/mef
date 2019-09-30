var express = require('express');
var router = express.Router();
var accountService = require("../services/account");
var userService = require("../services/user");

/* GET home page. */
router.get('/', function(req, res, next) {
  const {rol} = req.session;
  res.render('home', {rol});
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/login', (req, res) => {
  let { email, password } = req.body;
  accountService.auth(email, password)
    .then(user => {
      if( !user) {
        res.render('login', { error: "email y/o contrasena incorrectos!", email, password});
      }
      if (user) {
        req.session.userId = user.id;
        req.session.rol = ['jefe-exhibicion'];
        res.redirect('/');
      }
    });
});

router.post('/register', (req, res) => {
  userService.createUser(req).then(() => {
    res.render("info",{exito:true, mensaje:"Usuario creado exitosamente!"});
  }).catch( e => {
    res.render("info",{exito:false, mensaje: `Usuario no pudo ser creado: ${e}`})
  });
  //@TODO redireccionar a una pagina de no pudo ser creado o algo asi
});

module.exports = router;
