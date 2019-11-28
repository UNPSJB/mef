var express = require('express');
var router = express.Router();
var accountService = require("../services/account");
var userService = require("../services/user");
var permisos = require('../auth/permisos');

/* GET home page. */
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
        req.session.rol = user.Rol.descripcion; //viene de la DB @profe
        let rol = req.session.rol;
        res.render('home', {rol});
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
  //@TODO redireccionar a una pagina de no pudo ser creado o algo asi
});

router.delete('/logout', permisos.estaLogueado, (req,res)=>{
  req.session.destroy(()=>{
    res.redirect('/login');
  });
})

module.exports = router;
