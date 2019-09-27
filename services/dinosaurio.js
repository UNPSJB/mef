const models = require('../models')
let dino = models.Dinosaurio;
let subclase  = models.SubClase;
//aca va la logica del negocio
module.exports = {
    getDinosaurios(){//{ tags }//aca se pide datos a la BD        
        return dino.findAll({include:[subclase]});        
    },
    getDinosaurio( id ){
        return dino.findByPk(id);
    },
    createDinosaurio(nombre, alimentacion, periodo, descubrimiento, SubClaseId){
        return dino.create({
                nombre,
                alimentacion,
                periodo,
                descubrimiento,
                SubClaseId
            });
    },
    updateDinosaurio(dinoReq){
        return dino.upsert(dinoReq) //update or insert = upsert XD
                .catch(() =>{// sale mal
                    console.log("dino update sale mal");
                })    
    },
    deleteDinosaurio(id){
        return dino.findByPk(id)
            .then( (dinoEncontrado)=>{
                //existe ? lo modifico
                dinoEncontrado.destroy(dinoEncontrado);
            })//dino no existe
            .catch( (err) =>{//preguntar sobre esto
                console.log("dino no existe"+err)
            })
    }
}