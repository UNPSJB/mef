const models = require('../models');
let replica = models.Replica;

module.exports ={
    getReplicas(args){
        return replica.findAll({
            include:[models.Pedido, models.Hueso],
            where:{
                ...args
            },
            // PUEDE QUE VAYA UN INCLUDE, SINO, BORRAR ESTE COMENTARIO
        });
    },
    getReplica(id) {
        return replica.findOne({
            where: {
                id
            },
            // PUEDE QUE VAYA UN INCLUDE, SINO, BORRAR ESTE COMENTARIO
        });
    },
    createReplica(codigo, disponible, fecha_inicio, fecha_fin, fecha_baja, obs, PedidoId, HuesoId, DinosaurioId) {
        return replica.create({
            codigo,
            disponible,
            fecha_inicio,
            fecha_fin,
            fecha_baja,
            obs,
            PedidoId,
            HuesoId,
            DinosaurioId
        });
    },
    updateReplica(replicaReq){
        return replica.upsert(replicaReq)
    },
    deleteReplica(id){
        return replica.findByPk(id)
        .then((replicaEncontrada) => {
            replicaEncontrada.destroy(replicaEncontrada);
        })
    }
}