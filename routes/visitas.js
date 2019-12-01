const express = require('express');
const router = express.Router();
const visitaService = require('../services/visita');

//lista todas las visitas
router.get('/', (req, res, next) => {
    visitaService.getVisitas().then((results) => {
        res.render('visitas/visita', {
            results
        });
    });
});

//lista todos las visitas
router.get('/', (req, res, next) => {
    visitaService.getVisitas().then((results) => {
        res.render('visitas/visita', {
            results
        });
    });
});

router.get('/agregar', (req, res, next) => {
    res.render('visitas/agregar');
    /* Falta esto */
    /* Falta esto */
    /* Falta esto */
    /* Falta esto */
    /* Falta esto */
    /* Falta esto */
    /* Falta esto */
    /* Falta esto */
    /* Falta esto */
    /* Falta esto */
    /* Falta esto */
});

router.get('/editar', (req, res, next) => {
    visitaService.getvisita(req.query.id)
        .then((visita) => {
            res.render('visitas/editar', { visita });
        })
})

router.get('/eliminar', (req, res, next) => {
    const { id } = req.query;
    visitaService.getVisita(id)
        .then((visita) => {
            res.render('visitas/eliminar', { visita });
        })
});

router.post('/', (req, res, next) => {
    const { identificacion, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono, tipoCliente, personaid, tipo } = req.body;
    if (tipo == 'nuevo') {
        return clienteService.createCliente(tipoCliente, identificacion, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono)
            .then(() => { res.redirect('/visitas') })
            .catch(errores => {
                res.render('visitas/agregar', { errores });
            });
    }
});

router.put('/', (req, res, next) => {
    const { idVisita, identificacion, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono } = req.body;
    var personaBody = {
        "id": idVisita,
    }
    var visitaBody = {
        "id": idVisita,
    }

    return visitaService.getVisita(idVisita)
        .then(() => {
            visitaService.updateVisita(visitaBody)
                .then(() => {
                    res.redirect('/visitas');
                })
        })
})

router.delete('/', (req, res, next) => {
    const { id } = req.body;
    visitaService.deletevisita(id)
        .then(() => {
            res.redirect('/visitas')
        });
});

module.exports = router;