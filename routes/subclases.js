const express = require('express');
const router = express.Router();
const subclaseService = require('../services/subclase.js')


router.get('/', (req, res, next) => {
    subclaseService.getSubclases().then((result) => {
        res.render('subclases/subclase', {
            result,req
        });
    });
});

router.get('/api', (req, res, next) => {
    subclaseService.getSubclases().then((result) => {
        const json = JSON.stringify(result, null, 4);
        res.send(json);
    });
});

router.get('/agregar', (req, res, next) => { // esto llama solo a la vista
    res.render('subclases/agregar',{req});
});

router.get('/editar/:id', (req, res, next) => {
    const { id } = req.params;
    subclaseService.getSubclase(id)
        .then((subclase) => {
            res.render('subclases/editar', { subclase,req });
        })
});

router.get('/eliminar/:id', (req, res, next) => {
    const { id } = req.params;
    subclaseService.getSubclase(id)
        .then((subclase) => {
            res.render('subclases/eliminar', { subclase,req });
        });
});

router.post('/', (req, res, next) => {
    const { descripcion, clase } = req.body;
    subclaseService.createSubclase(descripcion, clase)
        .then((subclase) => {
            res.redirect('/subclases')
        })
        .catch((errores) => {
            const subclase = req.body;
            res.render("subclases/agregar", { errores, subclase,req })
        });
});

router.put('/', (req, res, next) => {
    const subclase = req.body;
    subclaseService.updateSubclase(subclase)
        .then(() => res.redirect('/subclases'))
        .catch((errores) => {
            const subclase = req.body;
            res.render("subclases/editar", { errores, subclase,req })
        });
});

router.delete('/', async (req, res) => {
    const { id } = req.body;
    try {
        await subclaseService.deleteSubclase(id)
    } catch (errores ) {
        const subclase = await subclaseService.getSubclase(id)
        return res.render("subclases/eliminar", { errores, subclase,req })
    }
    return res.redirect('/subclases');
});


module.exports = router;