const models = require('../models');

module.exports = {
    getVisitas(args){
        return models.Visita.findAll({
            where:{
                ...args
            },
            include: [{model: models.Cliente, include: models.Persona}, {model: models.Guia, include: models.Persona}, {model: models.Exhibicion}]
        });
    },
    getVisita( id ){
        return models.Visita.findOne({
            where:{
                id
            },
            include: [{model: models.Cliente, include: models.Persona}, {model: models.Guia, include: models.Persona}, {model: models.Exhibicion}]
        });
    },
    createVisita(ExhibicionId, ClienteId, GuiumId, cantidadDePersonas, fechaVisita, horario, precio){
        return models.Visita.create({
            ExhibicionId,
            ClienteId,
            GuiumId,
            cantidadDePersonas,
            fechaVisita,
            horario,
            precio,
            cancelada:false
        })
    },
    updateVisita(id, ExhibicionId, ClienteId, GuiumId, cantidadDePersonas, fechaVisita, horario, precio, cancelada = false){
        return models.Visita.findByPk(id)
            .then(visit => {
                return visit.update({
                    ExhibicionId,
                    ClienteId,
                    GuiumId,
                    cantidadDePersonas,
                    fechaVisita,
                    horario,
                    precio,
                    cancelada                    
                })
            });
    },
    deleteVisita(id){
        return models.Visita.findByPk(id)
            .then( (visita) => {
                visita.destroy();
            })
            
    }
}