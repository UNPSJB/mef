const express = require('express')
const permisos = require('../middlewares/permisos')
const router = express.Router()
const replicaService = require('../services/replicas')

router.get('/',
  (req, res) => {
    replicaService.getReplicas().then(results => {
      // console.log('asd', results)
      // res.render('replicas/replica', { results, req })
    })
  })

router.get('/editar/:id',
  async (req, res) => {
    const { id } = req.params
    const replica = await replicaService.getReplica(id)
    res.render('fosiles/editar', { replica, req })
  })

router.get('/eliminar/:id',
  (req, res) => {
    const { id } = req.params

    replicaService
      .getReplica(id)
      .then(replica => {
        console.log(replica)
        res.render('replicas/baja', { replica, req })
      })
      .catch(err => {
        console.log('error de baja')
      })
})

router.patch('/disponibilidad/:id',
  (req, res) => {
    const { id } = req.params
    replicaService.toggleDisponible(id)
    res.send(200)
})

router.delete('/',
  (req, res) => {
    replicaService.deleteReplica(req.body.id).then(() => res.redirect('/pedidos/replicas'))
})

module.exports = router