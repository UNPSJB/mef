const express = require('express');
const router = express.Router();
//cont visitaService = require('../services/visita');

//lista todos las visitas
router.get('/', (req, res, next) => {
    visitaService.getVisitas().then((results) => {
        res.render('visitas/visita', {
            results
        });
    });
});

router.get('/agregar',
    visitaService.getVisitas()
        .then((visitas) => {
            res.render('visitas/agregar', {
                visitas
            })
        }),

    router.get('/editar', (req, res, next) => {
        visitaService.getVisita(req.query.id)
            .then((visita) => {
                res.render('visita/editar', { visita });
            })
    }),

    router.get('/eliminar', (req, res, next) => {
        const { id } = req.query;
        visitaService.getVisita(id)
            .then((visita) => {
                res.render('visita/eliminar', { visita });
            })
    }),

    router.post('/', (req, res, next) => {
        const { identificacion, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono, tipoCliente, personaid, tipo } = req.body;
        if (tipo == 'nuevo') {
            return clienteService.createCliente(tipoCliente, identificacion, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono)
                .then(() => { res.redirect('/clientes') })
                .catch(errores => {
                    res.render('clientes/agregar', { errores });
                });

        }
    }),

    router.put('/', (req, res, next) => {
        const { fecha, horario, precio, cancelada } = req.body;
        var visitaBody = {
            "fecha": fecha,
            "horario": horario,
            "precio": precio,
            "cancelada": cancelada,
        }
    },


        // return visitaService.getVisita(idVisita)
        // .then(()=>{
        //     visitaService.updateVisita(visitaBody)
        //     .then(()=>{
        //                 res.redirect('/visitas');      
        //             })
        //         })



        router.delete('/', (req, res, next) => {
            // const { id } = req.body;
            visitaService.deleteVisita(id)
                .then(() => {
                    res.redirect('/visitas')
                });
        }),
        module.exports = router))