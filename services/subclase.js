const models = require('../models')

module.exports = {
    getSubclases(){
        return models.SubClase.findAll();
    },
    getSubclase(id){
        return models.SubClase.findByPk(id);
    },
    createSubclase(descripcion,clase){
        return models.SubClase.create({
            descripcion,
            clase
        });
    },
    deleteSubclase(id){
        return models.SubClase.findByPk(id)
        .then((subclaseEncontrado)=>{
            return subclaseEncontrado.destroy();
        })
    },
    updateSubclase(subclaseModificado){
        return models.SubClase.upsert(subclaseModificado);
    }
}

