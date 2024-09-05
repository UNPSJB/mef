const models = require('../models');
const { literal } = require('sequelize');

module.exports = {
  getReplicas(args) {
    return models.Pedido.findAll({
      include: [
        {
          attributes: [
            'id',
            [literal(`TO_CHAR("Replicas"."fecha_inicio", 'DD/MM/YYYY')`), 'fecha_inicio_formatted'],
            [literal(`TO_CHAR("Replicas"."fecha_fin", 'DD/MM/YYYY')`), 'fecha_fin_formatted'],
          ],
          model: models.Replica,
          required: true,
          right: true,
          include: [models.Hueso, models.Dinosaurio],
        },
      ],
      where: {
        ...args,
        tipo: 'Interno',
      },
    });
  },
  getReplica(id) {
    return models.Replica.findOne({
      where: {
        id,
      },
      include: [models.Pedido, models.Hueso, models.Dinosaurio],
    });
  },
  createReplica(codigo, disponible, fecha_inicio, fecha_fin, fecha_baja, obs, PedidoId, HuesoId, DinosaurioId) {
    return models.Replica.create({
      codigo,
      disponible,
      fecha_inicio,
      fecha_fin,
      fecha_baja,
      obs,
      PedidoId,
      HuesoId,
      DinosaurioId,
    });
  },
  updateReplica(replicaReq) {
    return models.Replica.upsert(replicaReq);
  },
  toggleDisponible(id) {
    return models.Replica.findByPk(id).then(replicaEncontrada => {
      const { disponible } = replicaEncontrada;
      return replicaEncontrada.update({
        disponible: !disponible,
      });
    });
  },
  async deleteReplica(id) {
    const replica = await models.Replica.findByPk(id);
    await replica.update({
      fecha_baja: new Date(),
      disponible: false,
    });
    await replica.destroy();
  },
};
