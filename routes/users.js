var express = require('express');
var router = express.Router();
const accountService = require("../services/account");
var userService = require("../services/user");

const roleExist = (r) => (req, res, next) => {
  if (req.session.roles.indexOf(r) === -1) {
    res.redirect('/users/login');
  } else {
    next();
  }
};

router.get('/solo-jefe', roleExist('jefe-taller'), function (req, res, next) {
  res.redirect('https://google.com');
});


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('home');
});


module.exports = router;
