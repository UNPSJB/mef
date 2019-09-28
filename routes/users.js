var express = require('express');
var router = express.Router();
const accountService = require("../services/account");
var userService = require("../services/user");

router.get('/solo-jefe', accountService.roleExist('jefe-taller'), function (req, res, next) {
  res.redirectToHome();
});

const redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/users');
  } else {
    next();
  }
};

const roleExist = (r) => (req, res, next) => {
  if (req.session.roles.indexOf(r) === -1) {
    res.redirect('/users/login');
  } else {
    next();
  }
};

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/users/login');
  } else {
    next();
  }
};

/* GET users listing. */
router.get('/solo-jefe', roleExist('jefe-taller'), function (req, res, next) {
  res.redirectToHome();
});


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('home');
});

router.get('/login', (req, res) => {
  res.render('login')
});
<<<<<<< Updated upstream
router.get('/register', (req, res) => {
=======
router.get('/register', redirectHome, (req, res) => {
>>>>>>> Stashed changes
  res.render('register', )
});

router.post('/login', (req, res) => {
  let { email, password } = req.body;
  accountService.auth(email, password)
    .then(user => {
      if (user) {
<<<<<<< Updated upstream
        req.session.user = user.id;
        req.session.roles = ['jefe-taller']; // user.roles
=======
        req.session.user = user; // user.roles
>>>>>>> Stashed changes
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
