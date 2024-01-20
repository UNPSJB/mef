var express = require('express');
var router = express.Router();
var accountService = require("../services/account");
var userService = require("../services/user");
var permisos = require('../middlewares/permisos');

router.get('/', permisos.asignaPermisos, permisos.estaLogueado, (req, res) => {
  try {
    res.render('home', { req });

  } catch (error) {
    console.log(error)
  }
});

router.get('/login', permisos.redirectHome, (req, res) => {
  res.render('login', { layout: 'login' });
});

router.post('/login', permisos.redirectHome, async (req, res) => {
  const { email, password } = req.body;
  const user = await accountService.auth(email, password)
  if (!user) {
    res.render('login', { layout: 'login', error: "e-mail y/o contraseña incorrectos!", email });
  }
  if (user) {
    const session = req.session;
    session.userId = user.id;
    session.rol = [...user.Rols];
    req.session.save();
    res.redirect('/');
  }
});

router.delete('/logout', permisos.estaLogueado, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
})


router.get('/403', permisos.estaLogueado, (req, res) => {
  res.render('error_403');
});


module.exports = router;
