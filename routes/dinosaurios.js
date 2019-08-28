var express = require('express');
var router = express.Router();
const DinoService = require('../services/dinosaurio')

let dinoService = new DinoService();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('dinosaurio',{
    nombre:'nombre de dino'
  });
});

module.exports = router;
