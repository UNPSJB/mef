const models = require('../models');
const { paginateModel } = require('./utils');
const { Op, literal } = require('sequelize');
const MIN_CHARS = 1;
const genericSearch = (search, fields) => {
  return fields.map(field => {
    if (field === 'Guium.Persona.identificacion') {
      return literal(`"Guium->Persona"."identificacion" ILIKE '%${search}%'`);
    } else if (field === 'Cliente.Persona.identificacion') {
      return literal(`"Cliente->Persona"."identificacion" ILIKE '%${search}%'`);
    } else if (field !== 'id') {
      // Calificar la referencia de columna con el nombre de la tabla apropiada
      return literal(`"Visita"."${field}"::text ILIKE '%${search}%'`);
    } else {
      // Calificar la referencia de columna con el nombre de la tabla apropiada
      return literal(`"Visita"."id"::text ILIKE '%${search}%'`);
    }
  });
};
module.exports = {
  getAllVisitas(args, opts = {}) {
    return models.Visita.findAll({
      where: {
        ...args,
      },
      include: [
        { model: models.Cliente, include: models.Persona },
        { model: models.Guia, include: models.Persona },
        { model: models.Exhibicion },
      ],
      ...opts,
    });
  },
  async getVisitasDataTable({ start, length, search, order, columns }) {
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
          'Cliente.Persona.identificacion',
          'Guium.Persona.identificacion',
          'fechaVisita',
        ]),
      };
    }
    return models.Visita.findAll({
      limit: length,
      offset: start,
      where: querySearch,
      order: literal(`${columnOrder} ${orderValue.dir}`),
      include: [
        { model: models.Cliente, include: models.Persona },
        { model: models.Guia, include: models.Persona },
        { model: models.Exhibicion },
      ],
    });
  },
  countVisitas() {
    return models.Visita.count();
  },
  getVisitas(page = 0, pageSize = 10, args) {
    return models.Visita.findAndCountAll({
      where: {
        ...args,
      },
      include: [
        { model: models.Cliente, include: models.Persona },
        { model: models.Guia, include: models.Persona },
        { model: models.Exhibicion },
      ],
      ...paginateModel({ page, pageSize }),
    });
  },
  getVisita(id, opts = {}) {
    return models.Visita.findOne({
      where: {
        id,
      },
      ...opts,
      include: [
        { model: models.Cliente, include: models.Persona },
        { model: models.Guia, include: models.Persona },
        { model: models.Exhibicion },
      ],
    });
  },
  createVisita(ExhibicionId, ClienteId, GuiumId, cantidadDePersonas, fechaVisita, horario, precio, estado, observacion) {
    return models.Visita.create({
      ExhibicionId,
      ClienteId,
      GuiumId,
      cantidadDePersonas,
      fechaVisita,
      horario,
      precio,
      estado,
      observacion,
      cancelada: false,
    });
  },
  async updateVisita(
    id,
    ExhibicionId,
    ClienteId,
    GuiumId,
    cantidadDePersonas,
    fechaVisita,
    horario,
    precio,
    estado,
    observacion,
    cancelada = false
  ) {
    const visita = await models.Visita.findByPk(id)
    return visita.update({
      ExhibicionId,
      ClienteId,
      GuiumId,
      cantidadDePersonas,
      fechaVisita,
      horario,
      precio,
      estado,
      observacion,
      cancelada
    });
  },
};