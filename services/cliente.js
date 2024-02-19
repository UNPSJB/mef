const models = require('../models');
const personaService = require('./persona');
const { paginateModel } = require('./utils');
const { Op, literal } = require('sequelize');
const MIN_CHARS = 1;
const genericSearch = (search, fields) => {
  return fields.map(field => {
    if (
      field === 'Persona.nombre' ||
      field === 'Persona.apellido' ||
      field === 'Persona.direccion' ||
      field === 'Persona.localidad' ||
      field === 'Persona.email' ||
      field === 'Persona.telefono'
    ) {
      // Si el campo pertenece a la tabla Persona, aplicamos ILIKE directamente
      return literal(`"Persona"."${field.split('.')[1]}" ILIKE '%${search}%'`);
    } else if (field === 'id') {
      // Si es el campo ID, lo tratamos como Persona.id
      return literal(`"Persona"."id"::text ILIKE '%${search}%'`);
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
    console.log(search);
    let querySearch = undefined;
    const [orderValue] = order;
    const columnOrder = columns[parseInt(orderValue.column)].data
      .split('.')
      .map(name => `"${name}"`)
      .join('.');

    if (search && search.length > MIN_CHARS) {
      console.log('ESTOY EN EL IF YOU');
      querySearch = {
        [Op.or]: genericSearch(search, [
          'id',
          'tipo',
          'Persona.nombre',
          'Persona.apellido',
          'Persona.direccion',
          'Persona.localidad',
          'Persona.email',
          'Persona.telefono',
        ]),
      };
    }
    console.log(querySearch);
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
    //preguntar a doni si asi eta bien
    const clienteEncontrado = await models.Cliente.findByPk(id);
    return clienteEncontrado.destroy(clienteEncontrado);
  },
};
