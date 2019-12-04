const models = require('../models');
let visita = models.Visita;

module.exports = {
    getVisitas(args){
        return visita.findAll({
            where:{
                ...args
            }
        });
    },
    getVisita( id ){
        return visita.findByPk(id);
    },
    
    
    
   createVisita(ExhibicionId, ClienteId, GuiaId, cantidad_personas, fecha, horario, precio){
        return visita.create({
            ExhibicionId,
            ClienteId,
            GuiaId,
            cantidad_personas,
            fecha,
            horario,
            precio, 
        })
    },
    updateVisita(visitaReq){
        return visita.upsert(visitaReq);
    },
    deleteVisita(id){
        return visita.findByPk(id)
            .then( (visitaEncontrado) => {
                visitaEncontrado.destroy(visitaEncontrado);
            })
            
    }
}