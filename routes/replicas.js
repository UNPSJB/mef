const express = require('express');
const router = express.Router();
const replicaService = require('../services/replicas');

router.get('/eliminar/:id', async (req, res) => {
  const { id } = req.params;
  const replica = await replicaService.getReplica(id);
  console.log(replica);
  res.render('replicas/baja', { replica, req });
});

router.patch('/disponibilidad/:id', (req, res) => {
  const { id } = req.params;
  replicaService.toggleDisponible(id);
  res.send(200);
});

router.delete('/', async (req, res) => {
  //Le falta un Try Catch para manejar los errores.
  await replicaService.deleteReplica(req.body.id);
  res.redirect('/pedidos/replicas?success=delete');
});

module.exports = router;
