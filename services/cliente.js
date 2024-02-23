const models = require('../models');
const personaService = require('./persona');
const { paginateModel } = require('./utils');
const { Op, literal } = require('sequelize');
const MIN_CHARS = 1;
const genericSearch = (search, fields) => {
  return fields.map(field => {
    if (field === 'Persona.fecha_nacimiento') {
      // Si el campo es fecha_nacimiento, comparamos solo por año, mes o día utilizando LIKE
      return literal(`TO_CHAR("Persona"."fecha_nacimiento", 'YYYY-MM-DD') LIKE '%${search}%'`);
    }
    if (
      field === 'Persona.nombre' ||
      field === 'Persona.apellido' ||
      field === 'Persona.localidad' ||
      field === 'Persona.identificacion' ||
      field === 'Persona.direccion'
    ) {
      // Si el campo pertenece a la tabla Persona, aplicamos ILIKE directamente
      return literal(`"Persona"."${field.split('.')[1]}" ILIKE '%${search}%'`);
    } else {
      // Si no pertenece a Persona ni es ID, asumimos que pertenece a Cliente y no prefixeamos
      return literal(`"${field}"::text ILIKE '%${search}%'`);
    }
  });
};
module.exports = {
  getAllClientes(args, opts = {}) {
    return models.Cliente.findAll({
      include: [models.Persona],
      where: {
        ...args,
      },
      ...opts,
    });
  },
  getClientesDataTable({ start, length, search, order, columns }) {
    let querySearch = undefined;
    const [orderValue] = order;
    const columnOrder = columns[parseInt(orderValue.column)].data
      .split('.')
      .map(name => `"${name}"`)
      .join('.');

    if (search && search.length > MIN_CHARS) {
      querySearch = {
        [Op.or]: genericSearch(search, [
          'tipo',
          'Persona.nombre',
          'Persona.identificacion',
          'Persona.apellido',
          'Persona.localidad',
          'Persona.fecha_nacimiento',
          'Persona.direccion',
        ]),
      };
    }
    return models.Cliente.findAll({
      limit: length,
      offset: start,
      where: querySearch,
      order: literal(`${columnOrder} ${orderValue.dir}`),
      include: [{ model: models.Persona, as: 'Persona' }],
    });
  },

  countClientes() {
    return models.Cliente.count();
  },
  getClientes(page = 0, pageSize = 10, args) {
    //{ tags }//aca se pide datos a la BD        //Cambia ya que no existe rol solo cliente
    return models.Cliente.findAndCountAll({
      include: [models.Persona],
      where: {
        ...args,
      },
      ...paginateModel({ page, pageSize }),
    });
  },
  getCliente(id, opts = {}) {
    return models.Cliente.findByPk(id, { include: [models.Persona], ...opts });
  },
  createClienteExiste(tipo, PersonaId) {
    return models.Cliente.create({
      tipo,
      PersonaId,
    });
  },

  updateCliente(clienteReq) {
    return models.Cliente.upsert(clienteReq);
  },
  async deleteCliente(id) {
    const clienteEncontrado = await models.Cliente.findByPk(id);
    return clienteEncontrado.destroy(clienteEncontrado);
  },
};
