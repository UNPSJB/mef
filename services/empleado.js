const models = require('../models');
const { paginateModel } = require('./utils');
const { Op, literal } = require('sequelize');
const MIN_CHARS = 1;
const genericSearch = (search, fields) => {
  return fields.map(field => {
    if (field === 'Persona.fecha_nacimiento') {
      return literal(`TO_CHAR("Persona"."fecha_nacimiento", 'YYYY-MM-DD') LIKE '%${search}%'`);
    }
    if (
      field === 'Persona.nombre' ||
      field === 'Persona.apellido' ||
      field === 'Persona.localidad' ||
      field === 'Persona.identificacion' ||
      field === 'Persona.direccion'
    ) {
      return literal(`"Persona"."${field.split('.')[1]}" ILIKE '%${search}%'`);
    } else {
      return literal(`"${field}"::text ILIKE '%${search}%'`);
    }
  });
};
module.exports = {
  getAllEmpleados(args) {
    return models.Empleado.findAll({
      include: [models.Persona],
      where: {
        ...args,
      },
      raw: true,
      nest: true,
    });
  },
  async getEmpleadosDataTable({ start, length, search, order, columns }) {
    let querySearch = undefined;
    const [orderValue] = order;
    const columnOrder = columns[parseInt(orderValue.column)].data
      .split('.')
      .map(name => `"${name}"`)
      .join('.');

    if (search && search.length > MIN_CHARS) {
      querySearch = {
        [Op.or]: genericSearch(search, [
          'Persona.nombre',
          'Persona.apellido',
          'Persona.direccion',
          'Persona.localidad',
          'Persona.fecha_nacimiento',
          'Persona.identificacion',
        ]),
      };
    }

    // Contar el número de registros filtrados
    const recordsFiltered = await models.Empleado.count({
      where: querySearch,
      include: [models.Persona],
    });

    // Imprimir la cantidad de registros filtrados en la consola
    console.log(`Número de registros filtrados: ${recordsFiltered}`);

    const empleados = await models.Empleado.findAll({
      limit: parseInt(length),
      offset: parseInt(start),
      where: querySearch,
      order: literal(`${columnOrder} ${orderValue.dir}`),
      include: [models.Persona],
    });

    return { empleados, recordsFiltered };
  },
  getEmpleados(page = 0, pageSize = 10, args) {
    //{ tags }//aca se pide datos a la BD        //Cambia ya que no existe rol solo empleado
    return models.Empleado.findAll({
      include: [models.Persona],
      where: {
        ...args,
      },
      paranoid: false,
    });
  },
  countEmpleados() {
    return models.Empleado.count();
  },
  //@TODO mostrar dino sin editar o algo
  getEmpleado(id, args = {}) {
    return models.Empleado.findByPk(id, { include: [models.Persona], ...args });
  },
  asignarAPedido(pedidoId, empleadoId) {
    return models.Pedido.findByPk(pedidoId).then(pedidoNuevo => {
      return models.Empleado.findByPk(empleadoId).then(empleado => {
        return models.Empleado.getPedidos().then(pedidosTrabajando => {
          pedidosTrabajando.push(pedidoNuevo);
          return models.Empleado.setPedidos(pedidosTrabajando);
        });
      });
    });
  },
  createEmpleado(PersonaId) {
    return models.Empleado.create({ PersonaId });
  },
  getPedidosTrabajando(empleadoID) {
    return models.Empleado.getPedidos();
  },
  updateEmpleado(empleadoReq) {
    //@TODO mostrar dino sin editar o algo
    return models.Empleado.upsert(empleadoReq);
  },
  async deleteEmpleado(id) {
    const empleado = await models.Empleado.findByPk(id);
    empleado.destroy(empleado);
  },
};
