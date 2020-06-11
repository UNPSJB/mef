const models = require('../models');

module.exports ={
    getReplicas(args){
        return models.Replica.findAll({
            include:[models.Pedido, models.Hueso, models.Dinosaurio],
            where:{
                ...args
            },
            // PUEDE QUE VAYA UN INCLUDE, SINO, BORRAR ESTE COMENTARIO
        });
    },
    getReplica(id) {
        return models.Replica.findOne({
            where: {
                id
            },
            include:[models.Pedido, models.Hueso, models.Dinosaurio]
            // PUEDE QUE VAYA UN INCLUDE, SINO, BORRAR ESTE COMENTARIO
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
            DinosaurioId
        });
    },
    updateReplica(replicaReq){
        return models.Replica.upsert(replicaReq)
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