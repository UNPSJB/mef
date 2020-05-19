const express = require('express');
const router = express.Router();
const visitaService = require('../services/visita');
const exhibicionService = require('../services/exhibicion')
const clienteService = require('../services/cliente')
const guiaService = require('../services/guia')

//lista todos las visitas
router.get('/', async (req, res) => {
    const visitas = await visitaService.getVisitas()
    console.log(visitas)
    res.render('visitas/visita', { results:visitas , req });
});

router.get('/agregar', async (req, res) => {
    const exhibiciones = await exhibicionService.getExhibiciones()
    const clientes = await clienteService.getClientes()
    const guias = await guiaService.getGuias()
    res.render('visitas/agregar',{exhibiciones, clientes, guias, req});
});

router.get('/editar/:id', async (req, res) => {
    const { id } = req.params
    const exhibiciones = await exhibicionService.getExhibiciones()
    const clientes = await clienteService.getClientes()
    const guias = await guiaService.getGuias()
    const visita = await visitaService.getVisita(id)
    res.render('visitas/editar', { visita, exhibiciones, clientes, guias, req });
})

router.get('/eliminar/:id', async (req, res) => {
    const { id } = req.params;
    const visita = await visitaService.getVisita(id)
    res.render('visitas/eliminar', { visita, req });
});

router.post('/', async (req, res) => {
    const {exhibicionId, clienteId, guiaId, cantidadPersonas, fecha, horario, precio} = req.body
    const visita = await visitaService.createVisita(exhibicionId,clienteId, guiaId, cantidadPersonas, fecha, horario, precio)
    res.redirect('/visitas')
});

router.put('/', async (req, res) => {
    const {id, exhibicionId, clienteId, guiaId, cantidadPersonas, fecha, horario, precio} = req.body

    return visitaService.updateVisita(id, exhibicionId, clienteId, guiaId, cantidadPersonas, fecha, horario, precio)
        .then(visita => {
            console.log('actualizado', visita)
            res.redirect('/visitas');
        })
})

router.delete('/', (req, res) => {
    const { id } = req.body;
    visitaService.deleteVisita(id)
        .then(() => {
            res.redirect('/visitas')
        });
});

module.exports = router;