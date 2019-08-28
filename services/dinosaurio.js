const dinosaurioMock = require('../utils/mocks/dinosaurios')
const models = require('../models')
let dino = models.Dinosaurio;
let subclase  = models.SubClase;
//aca va la logica del negocio
class DinosaurioService{
    constructor(){

    }

    getDinosaurios(){//{ tags }
        //aca se pide datos a la BD
        return Promise.resolve(dino.findAll()
            .then((dino) => {
                let dinosaurios = Object.assign({}, dino);
                console.log(dinosaurios);
        }));
    }
    getDinosaurio({ dinoId }){
        return Promise.resolve(dinosaurioMock[0]);
    }
    createDinosaurio({ dino }){
        return Promise.resolve(dinosaurioMock[0]);
    }
    updateDinosaurio({ dinoId }){
        return Promise.resolve(dinosaurioMock[0])
    }
    deleteDinosaurio({ dinoId }){
        return Promise.resolve(dinosaurioMock[0])
    }

}

module.exports = DinosaurioService;