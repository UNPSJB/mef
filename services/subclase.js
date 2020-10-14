const models = require('../models')
const { paginateModel } = require('./utils')

module.exports = {
  getAllSubclases(){
    return models.SubClase.findAll()
  },
  getSubclases(page = 0, pageSize = 10, args) {
    return models.SubClase.findAndCountAll({
      where: {
        ...args
      },
      ...paginateModel({ page, pageSize })
    })
  },
  getSubclase(id) {
    return models.SubClase.findByPk(id)
  },
  createSubclase(descripcion, clase) {
    return models.SubClase.create({
      descripcion,
      clase
    })
  },
  updateSubclase(subclaseModificado) {
    return models.SubClase.upsert(subclaseModificado)
  }
}

