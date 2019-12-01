const models = require('../models');

module.exports = {
    getExhibiciones(){
        return models.Exhibicion.findAll();
    },
    getExhibicion(id) {
        return models.Exhibicion.findByPk(id);
    },
    createExhibicion(nombre,tematica,duracion,fosiles,replicas){
        return models.Exhibicion.create({
            nombre,tematica,duracion
        }).then(exh => {
            if (Array.isArray(fosiles)){
                fosiles.forEach(fosil=>{
                    models.FosilExhibicion.create({
                        ExhibicionId:exh.id,
                        FosilId:fosil.id
                    })
                })
            }else{
                models.FosilExhibicion.create({
                    FosilId:fosiles.id,
                    ExhibicionId:exh.id
                })
            }
        }).catch(err =>{
            return err;
        })
    }
}