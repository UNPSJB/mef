var express = require('express');
var router = express.Router();
const accountService = require("../services/account");
var userService = require("../services/user");

router.get('/solo-jefe', accountService.roleExist('jefe-taller'), function (req, res, next) {
  res.redirectToHome();
});

router.get('/', function (req, res, next) {
  res.render('home');
});

router.get('/login', (req, res) => {
  res.render('login')
});
router.get('/register', (req, res) => {
  res.render('register', )
});

router.post('/login', (req, res) => {
  let { email, password } = req.body;
  accountService.auth(email, password)
    .then(user => {
      if (user) {
        req.session.user = user.id;
        req.session.roles = ['jefe-taller']; // user.roles
        res.redirect('/');
      }
      else {
        res.render('login', { error: "bla", email, password});
      }
    });
});

router.post('/register', (req, res) => {
  userService.createUser(req).then(() => {
    res.redirect("/users");
  }).catch("*****No pudo ser creado, sale mal");
  //@TODO redireccionar a una pagina de no pudo ser creado o algo asi
});

module.exports = router;
