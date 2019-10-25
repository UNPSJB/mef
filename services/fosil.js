const models = require('../models')
let fosil = models.Fosil;

module.exports ={
    getFosiles(){
        return fosil.findAll();
    },
    getFosil(id){
        return fosil.findByPk(id);
    },
    createFosil(numero_coleccion,peso,disponible,fecha_encontrado,observacion){
        return fosil.create({
                numero_coleccion,
                peso,
                disponible,
                fecha_encontrado,
                observacion
            });
    }
}