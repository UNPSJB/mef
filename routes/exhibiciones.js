const express = require('express')
const router = express.Router()
const permisos = require('../middlewares/permisos')
const exhibicionService = require('../services/exhibicion')
const fosilService = require('../services/fosil')
const pedidoService = require('../services/pedidos')
/**@TODO cambiar esto moverlo al service */
const models = require('../models')
const { generatePagination } = require('../services/utils')
const paginate = require('../middlewares/paginate')

router.get('/', async (req, res) => {
  try {
    const exhibiciones = await exhibicionService.getAllExhibiciones({},{raw:true})
    res.render('exhibiciones/exhibicion', { exhibiciones, req })
  } catch (error) {
    res.redirect('/404')
  }
})

router.get('/detalle/:id', async (req,res)=>{
  const {id} = req.params
  try {
    const exhibicion =  await exhibicionService.getExhibicion(id)
    const fosiles = await exhibicion.getFosils({include:[ models.Dinosaurio ], raw:true, nest:true})
    const replicas = await exhibicion.getReplicas({include:[models.Hueso, models.Dinosaurio, models.Pedido],raw:true, nest:true})
    console.log(exhibicion)
    /**@TODO esto tambien moverlo al service, aplica para otras cosas donde sea similar, usar mas objetos */
    res.render('exhibiciones/detalle', {exhibicion:exhibicion.dataValues, fosiles, replicas,req})
  } catch (error) {
    console.log(error)
    res.redirect('/404')
  }
})

router.get('/agregar', async (req, res) => {
  try {
    const replicas = await pedidoService.getReplicas({ disponible: true })
    const fosiles = await fosilService.getAllFosiles({ disponible: true })
    res.render('exhibiciones/agregar', { replicas, fosiles,req })
  } catch (error) {
    res.redirect('/404')
  }
})

router.get('/editar/:id', async (req, res) => {
  const { id } = req.params
  const replicas = await pedidoService.getReplicas({ disponible: true }, {raw:true, nest:true})
  const replicas_propias = await exhibicionService.getReplicas(id)
  const fosiles= await fosilService.getAllFosiles({ disponible: true })
  const fosiles_propios = await exhibicionService.getFosiles(id)
  const exhibicion = await exhibicionService.getExhibicion(id, {raw:true})
  res.render('exhibiciones/editar', { exh: exhibicion,req, fosiles, replicas, fosiles_propios, replicas_propias })
})

router.get('/eliminar/:id', async (req, res) => {
  const { id } = req.params
  const exhibicion = await exhibicionService.getExhibicion(id, {raw:true})
    res.render('exhibiciones/eliminar', { exh: exhibicion, id,req })
  })

router.post('/', async (req, res) => {
  const {nombre, tematica, duracion, fosiles, replicas} = req.body

  try {
    const exhibicion = await exhibicionService.createExhibicion(nombre,tematica,duracion,fosiles,replicas)
    res.redirect('/exhibiciones')
  } catch (error) {
    const { message } = error.errors[0]
    const replicas = await pedidoService.getReplicas({ disponible: true })
    const fosiles = await fosilService.getAllFosiles({ disponible: true })
    res.render('exhibiciones/agregar', {errores:message , nombre, tematica, replicas, fosiles, duracion,req})
  
  }
})

router.put('/', async (req,res)=>{
  const { id, nombre, tematica, duracion, fosiles, replicas } = req.body
  console.log('logs', id, nombre, tematica, duracion, fosiles, replicas)
  try {
    await exhibicionService.updateExhibicion(id, nombre, tematica, duracion, fosiles, replicas)
    res.redirect('/exhibiciones')
  } catch (error) {
    const { message } = error.errors[0]

    const exhibicion = await exhibicionService.getExhibicion(id)
    const replicas = await pedidoService.getReplicas({ disponible: true })
    const fosiles = await fosilService.getAllFosiles({ disponible: true })
    const replicas_propias = await exhibicionService.getReplicas(id)
    const fosiles_propios = await exhibicionService.getFosiles(id)

    res.render('exhibiciones/editar', { errores:message, exh:exhibicion ,req, fosiles, replicas, fosiles_propios, replicas_propias })
  }
})

router.delete('/', async (req,res)=>{
  const { id } = req.body 
  try {
    await exhibicionService.deleteExhibicion(id)
    res.redirect('/exhibiciones')
  } catch (errores) {
    res.render('exhibiciones/eliminar', errores)
  }
})

module.exports = router