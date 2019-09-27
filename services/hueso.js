const models = require('../models');
let dino = models.Dinosaurio;
let hueso = models.Hueso;

module.exports = {
    getHuesos(){
    
    },
    getHueso(){

    },
    create(nombre, numero, disponible, subtipohueso,idDinosaurio){
        return hueso.create({
            nombre,
            numero,
            disponible,
            subtipohueso,
            
        });
    }
}