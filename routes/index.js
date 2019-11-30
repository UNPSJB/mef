var express = require('express');
var router = express.Router();
var accountService = require("../services/account");
var userService = require("../services/user");
var permisos = require('../auth/permisos');

router.get('/', permisos.estaLogueado, function(req, res, next) {
  res.render('home',{layout:'second'});
});

router.get('/login', permisos.redirectHome,(req, res) => {
  res.render('login', {layout:'login'});
});

router.get('/register', permisos.redirectHome, (req, res) => {
  res.render('register',{layout:'second'});
});

router.post('/login', permisos.redirectHome, (req, res) => {
  const { email, password } = req.body;
  return accountService.auth(email, password)
    .then(user => {
      if( !user) {
        res.render('login', {layout:'login', error: "email y/o contrasena incorrectos!", email});
      }
      if (user) {
        req.session.userId = user.id;
        req.session.rol = user.Rol.descripcion;
        res.redirect('/');
      }
    });
});

router.post('/register', permisos.redirectHome, (req, res) => {
  const { email, password } = req.body;
  userService.createUser(email, password )
  .then(() => {
    res.render("info", {layout:'second',exito:true, mensaje:"Usuario creado exitosamente!"});
  })
  .catch( (e) => {
    res.render("info", {layout:'second',exito:false, mensaje: `Usuario no pudo ser creado: ${e}`})
  });
});

router.delete('/logout', permisos.estaLogueado, (req,res)=>{
  req.session.destroy(()=>{
    res.redirect('/login');
  });
})


router.get('/403', permisos.estaLogueado, function(req, res, next) {
  res.render('error_403');
});


module.exports = router;
