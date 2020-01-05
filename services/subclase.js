const models = require('../models')
let subclase = models.SubClase;

module.exports = {
    getSubclases(){
        return subclase.findAll();
    },
    getSubclase(id){
        return subclase.findByPk(id);
    },
    createSubclase(descripcion,clase){
        return subclase.create({
            descripcion,
            clase
        });
    },
    deleteSubclase(id){
        return subclase.findByPk(id)
        .then((subclaseEncontrado)=>{
            return subclaseEncontrado.destroy();
        })
    },
    updateSubclase(subclaseModificado){
        return subclase.upsert(subclaseModificado);
    }
}

