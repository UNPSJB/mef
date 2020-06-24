const express = require('express')
const permisos = require('../middlewares/permisos')
const router = express.Router()

const dinoService = require('../services/dinosaurio')
const fosilService = require('../services/fosil')

const bones = ['Cráneo', 'Torax','Vertebral', 'Pelvis','Brazo','Manos','Piernas','Pies']
const { generatePagination } = require('../services/utils')
const paginate = require('../middlewares/paginate')

router.get('/',
  async (req, res) => {
    try {
      const fosiles = await fosilService.getAllFosiles()
      res.render('fosiles/fosil', { results:fosiles, req })
    } catch (error) {
      res.redirect('/404')      
    }
  })

router.get('/agregar',
  (req, res) => {
    dinoService.getAllDinosaurios().then(results => {
      res.render('fosiles/agregar', { results, bones ,req })
    })
  })

router.get('/editar/:id',
  async (req, res) => {
    const { id } = req.params
    const fosil = await fosilService.getFosil(id)
    const dinosaurios = await dinoService.getAllDinosaurios()
    const dinosaurio = fosil.Dinosaurio
    res.render('fosiles/editar', { dinosaurio, dinosaurios , bones, fosil,req })
  })

router.get('/eliminar/:id',
  (req, res) => {
    const { id } = req.params
    fosilService
      .getFosil(id)
      .then(fosil => res.render('fosiles/eliminar', { fosil,req }))
      .catch(err => {
      })
  })

router.delete('/',
  (req, res) => {
    fosilService.deleteFosil(req.body.id).then(() => res.redirect('/fosiles'))
  })

router.put('/',
  (req, res) => {
    /** @todo agregar async await, render con objeto fosiles, error y request */
    fosilService.updateFosil(req.body).then(() => res.redirect('/fosiles'))
  })

router.post('/',
  async (req, res) => {
    const { DinosaurioId, huesos, numero_coleccion, peso, disponible, fecha_encontrado, observacion } = req.body
    try {
        // createFosil(numero_coleccion, peso, disponible, fecha_encontrado, observacion, DinosaurioId, huesos) {
      const fosil = await fosilService.createFosil(numero_coleccion, peso, disponible, fecha_encontrado, observacion, DinosaurioId, huesos )
      res.redirect('/fosiles')
    } catch (error) {
      /** @TODO revisar */
      const { message } = error.errors[0]
      const results =  await dinoService.getAllDinosaurios()
      res.render('fosiles/agregar', { results, dino: req.body, bones ,req, errores: message })
    }       
})

module.exports = router
