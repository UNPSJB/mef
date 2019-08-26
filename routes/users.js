var express = require('express');
var models = require('../models');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  let dino = models.Dinosaurio;
  dino.findAll().then((dinos) =>{ res.json(dinos)})
});

module.exports = router;
