const express = require('express');
const router = express.Router();
const fosilService = require('../services/fosil')

router.get('/', (req, res, next) => {
    fosilService.getFosiles()
        .then((results) => {
            res.render('fosiles/fosil', {
                results
            });
        });
});

router.get('/agregar', (req, res, next) => {
    res.render('fosiles/agregar'); 
});
router.get('/editar', (req, res, next) => {
    res.render('fosiles/editar'); 
});
router.get('/eliminar', (req, res, next) => {
    res.render('fosiles/eliminar'); 
});


router.post('/', (req, res, next)=>{
    const {numero_coleccion,peso,disponible,fecha_encontrado,observacion} = req.body;
    fosilService.createFosil(numero_coleccion,peso,disponible,fecha_encontrado,observacion)
    .then(()=>{res.redirect('/fosiles')})
});

module.exports = router;

