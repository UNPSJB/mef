const models = require('../models')
const { paginateModel } = require('./utils')
const { Op, literal } = require('sequelize')
module.exports = {
  getAllDinosaurios() {
    return models.Dinosaurio.findAll({
      include: [models.SubClase], raw: true, nest: true
    })
  },
  getDinosauriosDataTable({ draw, start, length, search, order, columns }) {
    let querySearch = undefined;
    const [orderValue] = order
    const columnOrder = columns[parseInt(orderValue.column)].data.split('.').map(name => `"${name}"`).join('.')
    
    if (search.value && search.value.length > 1) {
      querySearch = { [Op.or]: [{ nombre: { [Op.iLike]: `%${search.value}%` } }] }
    }

    return models.Dinosaurio.findAll({
      limit: length,
      offset: start,
      where: querySearch,
      order: literal(`${columnOrder} ${orderValue.dir}`),
      include: [models.SubClase]
    })
  },
  countDinosaurios() {
    return models.Dinosaurio.count()
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