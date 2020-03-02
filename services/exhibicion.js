const models = require('../models');

module.exports = {
  getExhibiciones() {
    return models.Exhibicion.findAll();
  },
  getExhibicion(id) {
    return models.Exhibicion.findByPk(id);
  },
  createExhibicion(nombre, tematica, duracion, fosiles, replicas) {
    return models.Exhibicion.create({
      nombre, tematica, duracion
    }).then(exhibicion => {
      if (fosiles) {//si hay fósiles, ponerlos como no disponibles
       const listaDeFosiles = [...fosiles]
       listaDeFosiles.every(async fosil_id=>{
         let fosil = await models.Fosil.findByPk(fosil_id)
         fosil.update({
           disponible:false
         })
       })
        exhibicion.setFosils(listaDeFosiles)
      }
      if(replicas){ 
          const listaDeReplicas = [...replicas]
          listaDeReplicas.every(async replica_id=>{
            let replica = await models.Replica.findByPk(replica_id)
            replica.update({
              disponible:false
            })
          })
        exhibicion.setReplicas(listaDeReplicas)
      }
    })
  },
  updateExhibicion(id, nombre, tematica, duracion) {
    return models.Exhibicion.findByPk(id).then(e => {
      return e.update({
        nombre,
        tematica,
        duracion
      })
    })
  },
  deleteExhibicion(id) {
    models.Exhibicion.findByPk(id).then(e => e.destroy());
  }
}