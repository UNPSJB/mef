var express = require('express');
var router = express.Router();
const accountService = require("../services/account");
var UserService = require("../services/user");
let userService = new UserService();

const redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/users');
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
router.get('/', redirectLogin, function (req, res, next) {
  res.render('home');
});

router.get('/login', redirectHome, (req, res) => {
  res.render('login')
});
router.get('/register', redirectHome, (req, res) => {
  res.render('register')
});

router.post('/login', redirectHome, (req, res) => {
  let { email, password } = req.body;
  accountService.auth(email, password)
    .then(user => {
      if (user) {
        req.session.userId = user.id;
        res.redirect('/');
      }
      else {
        res.render('login', { error: "bla", email, password});
      }
    });
});

router.post('/register', redirectHome, (req, res) => {
  userService.createUser(req).then(() => {
    res.redirect("/users");
  }).catch("*****No pudo ser creado, sale mal");
  //@TODO redireccionar a una pagina de no pudo ser creado o algo asi
});

module.exports = router;
