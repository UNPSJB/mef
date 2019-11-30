const models = require('../models');
let fosil = models.Fosil;

module.exports ={
    getFosiles(){
        return fosil.findAll({include:models.Dinosaurio});
    },
    getFosil(id){
        return fosil.findByPk(id);
    },
    createFosil(numero_coleccion,peso,disponible,fecha_encontrado,observacion,DinosaurioId,huesos){
        return fosil.create({
                numero_coleccion,
                peso,
                disponible,
                fecha_encontrado,
                observacion,
                DinosaurioId,
                huesos
            });
    },
    updateFosil(fosilReq){
        return fosil.upsert(fosilReq) //update or insert = upsert XD

    },
    deleteFosil(id){
        return fosil.findByPk(id)
            .then( (fosilEncontrado)=>{
                // existe ? lo modifico
                fosilEncontrado.destroy(fosilEncontrado);
            })// fosil no existe
           
    }
}