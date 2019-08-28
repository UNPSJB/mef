const express = require('express')
const DinoService = require('../../services/dinosaurio');
const router = express.Router();

const dinoService = new DinoService();


//Esto corresponde a /dinosaurios
//CUATRO METODOS : get, post, put, delete
router.get('/', async (req, res, next) => {
    // const { tags } = req.query;
    try{
        const dinos = await dinoService.getDinosaurios({tags})

        res.status(200).json({
            data:dinos,
            message:'dinos mostrados'
        })
    }catch(err){
        next(err);
    }

});
router.get('/:idProduct', (req,res) => {
    const { productId } = req.params;
    res.status(200).json({
        data: dinoService,
        message: 'dino retrieved'
    });
});

router.post('/', (req,res) => {
    res.status(201).json({
        data: dinoService[0],
        message: 'dino listed'
    });
});

router.put('/:id', (req,res) => {
    const { id } = req.params;
    res.status(200).json({
        data: dinoService[0],
        message: 'dino updated'
    });
});

router.delete('/:id', (req,res) => {
    const { id } = req.params;
    res.status(200).json({
        data: dinoService[0],
        message: 'dino deleted'
    });
});

module.exports = router;