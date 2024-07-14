const models = require('../models');
const { paginateModel } = require('./utils');
const { Op, literal } = require('sequelize');
const MIN_CHARS = 1;
const genericSearch = (search, fields) => {
  return fields.map(field => {
    if (field === 'Dinosaurio.nombre') {
      return literal(`"Dinosaurio"."nombre" ILIKE '%${search}%'`);
    }
    return literal(`"Fosil"."${field}"::text ILIKE '%${search}%'`);
  });
};
module.exports = {
  getAllFosiles(args) {
    return models.Fosil.findAll({
      include: [models.Dinosaurio],
      raw: true,
      nest: true,
      where: {
        ...args,
      },
    });
  },
  getFosilesDataTable({ start, length, search, order, columns }) {
    let querySearch = undefined;
    const [orderValue] = order;
    const columnOrder = columns[parseInt(orderValue.column)].data
      .split('.')
      .map(name => `"${name}"`)
      .join('.');

    if (search && search.length > MIN_CHARS) {
      querySearch = {
        [Op.or]: genericSearch(search, [
          'id',
          'numero_coleccion',
          'Dinosaurio.nombre',
          'disponible',
          'peso',
          'fecha_encontrado',
          'huesos',
        ]),
      };
    }

    return models.Fosil.findAll({
      limit: length,
      offset: start,
      where: querySearch,
      order: literal(`${columnOrder} ${orderValue.dir}`),
      include: [{ model: models.Dinosaurio, as: 'Dinosaurio' }],
    });
  },
  countFosiles() {
    return models.Fosil.count();
  },
  getFosiles(page = 0, pageSize = 10, args) {
    return models.Fosil.findAndCountAll({
      include: [models.Dinosaurio],
      where: {
        ...args,
      },
      ...paginateModel({ page, pageSize }),
    });
  },
  getFosil(id) {
    return models.Fosil.findOne({
      where: {
        id,
      },
      include: models.Dinosaurio,
      raw: true,
      nest: true,
    });
  },
  createFosil(numero_coleccion, peso, disponible, fecha_encontrado, observacion, DinosaurioId, huesos) {
    const pesoParseado = parseFloat(peso);
    return models.Fosil.create({
      numero_coleccion,
      peso: pesoParseado,
      disponible,
      fecha_encontrado,
      observacion,
      DinosaurioId,
      huesos,
    });
  },
  toggleDisponible(id) {
    return models.Fosil.findByPk(id).then(fosilEncontrado => {
      return fosilEncontrado.update({
        disponible: !disponible,
      });
    });
  },
  updateFosil(fosilReq) {
    return models.Fosil.update(fosilReq, { where: { id: fosilReq.id } });
  },
};
