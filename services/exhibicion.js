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
      if (fosiles) {
        exhibicion.setFosils([...fosiles])
      }
      if(replicas){ 
        exhibicion.setReplicas([...replicas])
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