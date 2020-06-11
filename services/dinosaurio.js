const models = require('../models')

module.exports = {
    getDinosaurios(){//{ tags }//aca se pide datos a la BD        
        return models.Dinosaurio.findAll({include:[models.SubClase]});        
    },
    getDinosaurio( id ){
        return models.Dinosaurio.findByPk(id);
    },
    createDinosaurio(nombre, alimentacion, periodo, descubrimiento, SubClaseId){
        return models.Dinosaurio.create({
                nombre,
                alimentacion,
                periodo,
                descubrimiento,
                SubClaseId
            });
    },
    updateDinosaurio(dinoReq){
        return models.Dinosaurio.upsert(dinoReq) //update or insert = upsert XD    
    },
    deleteDinosaurio(id){
        return models.Dinosaurio.findByPk(id)
            .then( (dinoEncontrado)=>{
                //existe ? lo modifico
                return dinoEncontrado.destroy(dinoEncontrado);
            })//dino no existe
    }
}