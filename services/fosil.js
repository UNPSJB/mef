const models = require('../models')
let fosil = models.Fosil;

class FosilService{
    constructor(){

    }
    getFosiles(){
        return Promise.resolve(fosil.findAll());
    }
    createFosil(fosilReq){
        return Promise.resolve(
            fosil.create({
                numero_coleccion: fosilReq.numero_coleccion,
                peso: fosilReq.peso,
                disponible: fosilReq.disponible,
                fecha_encontrado: fosilReq.encontrado,
                observacion: fosilReq.observacion
            }).then((fosilReq) => {
                console.log("creado servie fosilReq", fosilReq);
            }).catch((err)=>{
                console.log(err);
            })
        )};
}

module.exports = FosilService;
