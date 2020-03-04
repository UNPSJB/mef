const models = require('../models');
let replica = models.Replica;

module.exports ={
    getReplicas(args){
        return replica.findAll({
            include:[models.Pedido, models.Hueso, models.Dinosaurio],
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
            include:[models.Pedido, models.Hueso, models.Dinosaurio]
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
    toggleDisponible(id){
        return models.Replica.findByPk(id)
        .then((replicaEncontrada) => {
            return replicaEncontrada.update({
                disponible: !disponible
            });
        })
    },
    deleteReplica(id){
        return models.Replica.findByPk(id)
        .then((replicaEncontrada) => {
            return replicaEncontrada.update({
                fecha_baja:new Date(),
                disponible:false
            });
        })
    }
}