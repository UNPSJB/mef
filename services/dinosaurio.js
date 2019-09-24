const dinosaurioMock = require('../utils/mocks/dinosaurios')
const models = require('../models')
let dino = models.Dinosaurio;
let subclase  = models.SubClase;
//aca va la logica del negocio
class DinosaurioService{
    constructor(){

    }
    getDinosaurios(){//{ tags }//aca se pide datos a la BD        
        return Promise.resolve(dino.findAll()).catch((e)=>{console.log(e)});        
    }
    getDinosaurio({ id }){
        return Promise.resolve(dino.findByPk(id).catch((e)=>{console.log("busqueda sale mal")}));
    }
    createDinosaurio( dinoReq ){
        return Promise.resolve(
            dino.create({
                nombre: dinoReq.nombre,
                alimentacion: dinoReq.alimentacion,
                periodo: dinoReq.periodo,
                descubrimiento: dinoReq.descubrimiento
            }).then((dino) =>{
                console.log("creado service ",dino);
            }).catch((err)=>{
                console.log(err);
            })
        );
    }
    updateDinosaurio( dinoReq ){
        return Promise.resolve(
            dino.upsert(dinoReq) //update or insert = upsert XD
            .catch(() =>{
                console.log("dino update sale mal");
            })
        )
    }
    deleteDinosaurio({ id }){
        return Promise.resolve(
            //busco el id del dino
            dino.findByPk(id)
            .then( (dinoEncontrado)=>{
                console.log("\npk :"+id);
                console.log(dinoEncontrado);
                //existe ? lo modifico
                dinoEncontrado.destroy(dinoEncontrado);
            })
            //dino no existe
            .catch( (err) =>{
                console.log(err)
            })
        )
    }
}

module.exports = DinosaurioService;