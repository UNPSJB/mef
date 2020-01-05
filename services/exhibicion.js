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
                        FosilId:fosil
                    })
                })
            }else{
                models.FosilExhibicion.create({
                    FosilId:fosiles,
                    ExhibicionId:exh.id
                })
            }
            if (Array.isArray(replicas)){
                replicas.forEach(Replica=>{
                    models.ReplicaExhibicion.create({
                        ExhibicionId:exh.id,
                        ReplicaId:Replica
                    })
                })
            }else{
                models.ReplicaExhibicion.create({
                    ReplicaId:replicas,
                    ExhibicionId:exh.id
                })
            }
        }).catch(err =>{
            return err;
        })
    },
    updateExhibicion(id,nombre,tematica,duracion){
        return models.Exhibicion.findByPk(id).then(e=>{
            return e.update({
                nombre,
                tematica,
                duracion
            })
        })
    },
    deleteExhibicion(id){
        models.Exhibicion.findByPk(id).then(e => e.destroy());
    }
}