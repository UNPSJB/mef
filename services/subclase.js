const models = require('../models')
const { paginateModel } = require('./utils')

module.exports = {
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
  deleteSubclase(id) {
    return models.SubClase.findByPk(id)
      .then((subclaseEncontrado) => {
        return subclaseEncontrado.destroy()
      })
  },
  updateSubclase(subclaseModificado) {
    return models.SubClase.upsert(subclaseModificado)
  }
}

