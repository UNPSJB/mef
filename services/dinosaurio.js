const models = require('../models')
const { paginateModel } = require('./utils')

module.exports = {
  getAllDinosaurios() {
    return models.Dinosaurio.findAll({
      include: [models.SubClase], raw: true, nest: true
    })
  },
  getDinosaurios(page = 0, pageSize = 10, args) {
    return models.Dinosaurio.findAndCountAll({
      include: [models.SubClase], 
      where: {
        ...args
      },
      ...paginateModel({ page, pageSize })
    })
  },
  getDinosaurio(id) {
    return models.Dinosaurio.findByPk(id, {
      include: [models.SubClase], raw: true, nest: true
    })
  },
  createDinosaurio(nombre, alimentacion, periodo, descubrimiento, SubClaseId) {
    return models.Dinosaurio.create({
      nombre,
      alimentacion,
      periodo,
      descubrimiento,
      SubClaseId
    })
  },
  updateDinosaurio(dinoReq) {
    return models.Dinosaurio.update(dinoReq, { where: { id: dinoReq.id } })
  },
}