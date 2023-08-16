const models = require('../models')
const { paginateModel } = require('./utils')

module.exports = {
  getAllSubclases() {
    return models.SubClase.findAll({ raw: true })
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
    return models.SubClase.findByPk(id, {raw:true})
  },
  createSubclase(descripcion, clase) {
    return models.SubClase.create({
      descripcion,
      clase
    })
  },
  updateSubclase(subclaseModificado) {
    return models.SubClase.update(subclaseModificado, {where: {id:subclaseModificado.id}})
  }
}

