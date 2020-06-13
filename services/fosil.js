const models = require('../models')
const { paginateModel } = require('./utils')

module.exports = {
  getFosiles(page = 0, pageSize = 10, args) {
    return models.Fosil.findAndCountAll({
      include: [models.Dinosaurio],
      where: {
        ...args
      },
      ...paginateModel({ page, pageSize })
    })
  },
  getFosil(id) {
    return models.Fosil.findOne({
      where: {
        id
      },
      include: models.Dinosaurio
    })
  },
  createFosil(numero_coleccion, peso, disponible, fecha_encontrado, observacion, DinosaurioId, huesos) {
    return models.Fosil.create({
      numero_coleccion,
      peso,
      disponible,
      fecha_encontrado,
      observacion,
      DinosaurioId,
      huesos
    })
  },
  updateFosil(fosilReq) {
    return models.Fosil.upsert(fosilReq) //update or insert = upsert XD
  },
  deleteFosil(id) {
    return models.Fosil.findByPk(id)
      .then((fosilEncontrado) => {
        // existe ? lo modifico
        fosilEncontrado.destroy(fosilEncontrado)
      })// fosil no existe
  }
}