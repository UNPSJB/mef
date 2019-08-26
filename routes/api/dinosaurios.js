const express = require('express')
const dinoMocks = require('../../utils/mocks/dinosaurios');
const router = express.Router();

var models = require('../../models');

//Esto corresponde a /dinosaurios
//CUATRO METODOS : get, post, put, delete
router.get('/', (req,res) => {
    // const { query } = req.query;
    let dino = models.Dinosaurio;
    dino.findAll().then((dinos) =>{ res.json(dinos)})
});
router.get('/:idProduct', (req,res) => {
    const { productId } = req.params;
    res.status(200).json({
        data: dinoMocks,
        message: 'dino retrieved'
    });
});

router.post('/', (req,res) => {
    res.status(201).json({
        data: dinoMocks[0],
        message: 'dino listed'
    });
});

router.put('/:id', (req,res) => {
    const { id } = req.params;
    res.status(200).json({
        data: dinoMocks[0],
        message: 'dino updated'
    });
});

router.delete('/:id', (req,res) => {
    const { id } = req.params;
    res.status(200).json({
        data: dinoMocks[0],
        message: 'dino deleted'
    });
});

module.exports = router;