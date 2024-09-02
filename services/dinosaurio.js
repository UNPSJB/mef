const models = require('../models');
const { paginateModel } = require('./utils');
const { Op, literal } = require('sequelize');
const MIN_CHARS = 1;
const genericSearch = (search, fields) => {
  return fields.map(field => {
    if (field === 'SubClase.descripcion') {
      return literal(`"SubClase"."descripcion" ILIKE '%${search}%'`);
    } else if (field === 'id') {
      return literal(`"Dinosaurio"."id"::text ILIKE '%${search}%'`);
    } else {
      return literal(`"${field}"::text ILIKE '%${search}%'`);
    }
  });
};
module.exports = {
  getAllDinosaurios() {
    return models.Dinosaurio.findAll({
      include: [models.SubClase],
      raw: true,
      nest: true,
    });
  },

  async getDinosauriosDataTable({ start, length, search, order, columns }) {
    let querySearch = undefined;
    const [orderValue] = order;
    const columnOrder = columns[parseInt(orderValue.column)].data
      .split('.')
      .map(name => `"${name}"`)
      .join('.');

    if (search.value && search.value.length > MIN_CHARS) {
      querySearch = {
        [Op.or]: genericSearch(search.value, [
          'id',
          'nombre',
          'alimentacion',
          'periodo',
          'descubrimiento',
          'SubClase.descripcion',
        ]),
      };
    }

    // Contar el número de registros filtrados
    const recordsFiltered = await models.Dinosaurio.count({
      where: querySearch,
      include: [models.SubClase],
    });

    // Imprimir la cantidad de registros filtrados en la consola
    console.log(`Número de registros filtrados: ${recordsFiltered}`);

    const dinosaurios = await models.Dinosaurio.findAll({
      limit: length,
      offset: start,
      where: querySearch,
      order: literal(`${columnOrder} ${orderValue.dir}`),
      include: [models.SubClase],
    });

    return { dinosaurios, recordsFiltered };
  },
  countDinosaurios() {
    return models.Dinosaurio.count();
  },
  getDinosaurios(page = 0, pageSize = 10, args) {
    return models.Dinosaurio.findAndCountAll({
      include: [models.SubClase],
      where: {
        ...args,
      },
      ...paginateModel({ page, pageSize }),
    });
  },

  getDinosaurio(id) {
    return models.Dinosaurio.findByPk(id, {
      include: [models.SubClase],
      raw: true,
      nest: true,
    });
  },
  createDinosaurio(nombre, alimentacion, periodo, descubrimiento, SubClaseId) {
    return models.Dinosaurio.create({
      nombre,
      alimentacion,
      periodo,
      descubrimiento,
      SubClaseId,
    });
  },
  updateDinosaurio(dinoReq) {
    return models.Dinosaurio.update(dinoReq, { where: { id: dinoReq.id } });
  },
};
