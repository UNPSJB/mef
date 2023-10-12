const express = require('express')
const router = express.Router()
const visitaService = require('../services/visita')
const exhibicionService = require('../services/exhibicion')
const clienteService = require('../services/cliente')
const guiaService = require('../services/guia')

const paginate = require('../middlewares/paginate')
const { generatePagination } = require("../services/utils")

router.get('/', async (req, res) => {
  try {
    const visitas = await visitaService.getAllVisitas({},{raw:true,nest:true})
    res.render('visitas/visita', { visitas, req })
  } catch (error) {
    console.log(error)
  }
})

router.get('/agregar', async (req, res) => {
  const exhibiciones = await exhibicionService.getAllExhibiciones({},{raw:true,nest:true})
  const clientes = await clienteService.getAllClientes({},{raw:true,nest:true})
  const guias = await guiaService.getAllGuias()
  res.render('visitas/agregar', { exhibiciones, clientes, guias, req })
})

router.get('/editar/:id', async (req, res) => {
  const { id } = req.params
  const exhibiciones = await exhibicionService.getAllExhibiciones()
  const clientes = await clienteService.getAllClientes()
  const guias = await guiaService.getAllGuias()
  const visita = await visitaService.getVisita(id)
  res.render('visitas/editar', { visita, exhibiciones, clientes, guias, req })
})

router.get('/eliminar/:id', async (req, res) => {
  const { id } = req.params
  const visita = await visitaService.getVisita(id, {raw:true,nest:true})
  res.render('visitas/eliminar', { visita, req })
})

router.post('/', async (req, res) => {
  const { exhibicionId, clienteId, guiaId, cantidadPersonas, fecha, horario, precio } = req.body
  /** @TODO agregar try catch y la vista de agregar visita */
  try {
    await visitaService.createVisita(exhibicionId, clienteId, guiaId, cantidadPersonas, fecha, horario, precio)
    res.redirect('/visitas')
  } catch (error) {
    res.render('visitas/agregar', { req })    
  }
})

router.put('/', async (req, res) => {
  const { id, exhibicionId, clienteId, guiaId, cantidadPersonas, fecha, horario, precio } = req.body
  /** agregar async await, try catch, render con visitas, request, error */
  return visitaService.updateVisita(id, exhibicionId, clienteId, guiaId, cantidadPersonas, fecha, horario, precio)
    .then(visita => {
      res.redirect('/visitas')
    })
})

router.delete('/', (req, res) => {
  const { id } = req.body
  visitaService.deleteVisita(id)
    .then(() => {
      res.redirect('/visitas')
    })
})

module.exports = router