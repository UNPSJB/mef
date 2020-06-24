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
    const exhibiciones = await exhibicionService.getAllExhibiciones()
    res.render('exhibiciones/exhibicion', { exhibiciones, req })
  } catch (error) {
    res.redirect('/404')
  }
})

router.get('/detalle/:id', async (req,res)=>{
  const {id} = req.params
  try {
    const exhibicion =  await exhibicionService.getExhibicion(id)
    const fosiles = await exhibicion.getFosils()
    const replicas = await exhibicion.getReplicas({include:[models.Hueso, models.Pedido]})
    /**@TODO esto tambien moverlo al service, aplica para otras cosas donde sea similar, usar mas objetos */
    res.render('exhibiciones/detalle', {exhibicion, fosiles, replicas})
  } catch (error) {
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
  const replicas = await pedidoService.getReplicas({ disponible: true })
  const replicas_propias = await exhibicionService.getReplicas(id)
  const fosiles= await fosilService.getAllFosiles({ disponible: true })
  const fosiles_propios = await exhibicionService.getFosiles(id)
  
  exhibicionService.getExhibicion(id).then(exh => {
    /** @TODO poner los fosiles/replicas ya usados tildados */
    res.render('exhibiciones/editar', { exh,req, fosiles, replicas, fosiles_propios, replicas_propias })
  })
})

router.get('/eliminar/:id', (req, res) => {
  const { id } = req.params
  exhibicionService.getExhibicion(id).then(exh => {
    res.render('exhibiciones/eliminar', { exh, id,req })
  })
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
    res.render('exhibiciones/agregar', {errores:message , nombre, tematica, replicas, fosiles, fosiles_propios, replicas_propias, duracion,req})
  
  }
})

router.put('/', async (req,res)=>{
  const { id, nombre, tematica, duracion } = req.body
  try {
    const exhibicion = await exhibicionService.getExhibicion(id)
    await exhibicion.update({
      ...req.body
    })
    // .updateExhibicion(id, nombre, tematica, duracion, fosiles, replicas)    
    res.redirect('/exhibiciones')
  } catch (error) {
    const { message } = error.errors[0]
    /** @todo agregar objetos de exhibicion, request y error */
    const exhibicion = await exhibicionService.getExhibicion(id)

    const replicas = await pedidoService.getReplicas({ disponible: true })
    const fosiles = await fosilService.getAllFosiles({ disponible: true })

    const replicas_propias = await exhibicionService.getReplicas(id)
    const fosiles_propios = await exhibicionService.getFosiles(id)

    res.render('exhibiciones/editar', { errores:message, exh:exhibicion ,req, fosiles, replicas, fosiles_propios, replicas_propias })

    // res.render('exhibiciones/editar', {errores:message , nombre, tematica, replicas, fosiles, duracion, req})
  }
})

router.delete('/', async (req,res)=>{
  const { id } = req.body 
  try {
    await exhibicionService.deleteExhibicion(id)
    /* @TODO poner en disponibles todas las exhibiciones */
    res.redirect('/exhibiciones')
  } catch (errores) {
    res.render('exhibiciones/eliminar', errores)
  }
})

module.exports = router
