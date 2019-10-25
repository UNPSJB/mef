const models = require('../models')
let subclase = models.SubClase;

module.exports = {
    
    getSubclases(){
        return subclase.findAll().catch((e)=>{console.log(e)});
    },
    getSubclase(id){
        return subclase.findByPk(id).catch(e=>console.log(e));
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
            subclaseEncontrado.destroy();
        }).catch( (err) =>{
            console.log("subclase no existe"+err)
        });
    },
    updateSubclase(subclaseModificado){
        return subclase.upsert(subclaseModificado);
    }
}

