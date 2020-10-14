const express = require('express')
const router = express.Router()
const subclaseService = require('../services/subclase.js')
const { generatePagination } = require('../services/utils')
const paginate = require('../middlewares/paginate')

router.get('/', async (req, res) => {
  try {
    const subclase = await subclaseService.getAllSubclases()
    res.render('subclases/subclase', { subclase, req })
  } catch (error) {
    res.redirect('/404')
  }
})

router.get('/api', async (req, res) => {
  const subclases = await subclaseService.getSubclases()
  const json = JSON.stringify(result = subclases, null, 4)
  res.send(json)
})

router.get('/agregar', async (req, res) => { // esto llama solo a la vista
  res.render('subclases/agregar', { req })
})

router.get('/editar/:id', async (req, res) => {
  const { id } = req.params
  const subclase = await subclaseService.getSubclase(id)
  const { clase } = subclase
  const [ ornitisquio, saurisquio ] = [ clase === 'Ornitisquio', clase === 'Saurisquio']
  res.render('subclases/editar', { ornitisquio, saurisquio, subclase, req })
})

router.post('/', async (req, res) => {
  const { descripcion, clase } = req.body
  try {
    const subclase = await subclaseService.createSubclase(descripcion, clase)
    res.redirect('/subclases')
  } catch (error) {
    const { message } = error.errors[0]
    const subclase = req.body
    /** @TODO revisar */
    res.render('subclases/agregar', { errores:message, subclase, req })  
  }
})

router.put('/', async (req, res) => {
  const subclase = req.body
  try {
    const subclaseDB = await subclaseService.getSubclase(subclase.id)
    await subclaseDB.update({
      ...subclase
    })
    res.redirect('/subclases')
  } catch (error) {
    const { message } = error.errors[0]
    res.render('subclases/editar', { errores: message, subclase, req })
  }
})




module.exports = router