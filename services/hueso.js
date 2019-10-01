var models = require('../models');
let dino = models.Dinosaurio;
var hueso = models.Hueso;

module.exports = {
    getHuesos(){
        return hueso.findAll()
    },
    getHueso(id){
        return hueso.findOne({
            where:{
                id
            }
        })
    },
    getHuesoDino(DinosaurioId){
        return hueso.findOne({
            where:{
                DinosaurioId
            }
        })
    },
    createHueso(nombre, numero, subtipohueso, DinosaurioId){
        return hueso.create({
            nombre,
            numero,
            subtipohueso,
            DinosaurioId
        });
    }
}