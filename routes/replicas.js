const express = require('express')
const permisos = require('../middlewares/permisos')
const router = express.Router()
const replicaService = require('../services/replicas')


router.get('/eliminar/:id',
  async (req, res) => {
    const { id } = req.params
    const replica = await replicaService.getReplica(id)
    console.log(replica)
    res.render('replicas/baja', { replica, req })
  })


router.patch('/disponibilidad/:id',
  (req, res) => {
    const { id } = req.params
    replicaService.toggleDisponible(id)
    res.send(200)
  })

router.delete('/',
  async (req, res) => {
    //aca bastaria el awit nomas? no hago nada con delate replica  
    await replicaService.deleteReplica(req.body.id)
    res.redirect('/pedidos/replicas')
  })

module.exports = router