const models = require('../models');
const INTERNO = 'Interno';
const EXTERNO = 'Externo';
const CONFIRMADO = 'Confirmado';
const PRESUPUESTADO = 'Presupuestado';
const { paginateModel } = require('./utils');
const { Op, literal } = require('sequelize');
const MIN_CHARS = 1;
const genericSearch = (search, fields) => {
  return fields.map(field => {
    if (field === 'Dinosaurio.nombre') {
      console.log('Entreeee', field);
      return literal(`"Detalles->Hueso->Dinosaurio"."nombre" ILIKE '%${search}%'`);
    }
    if (field === 'createdAt') {
      // Si el campo es fecha_nacimiento, comparamos solo por año, mes o día utilizando LIKE
      return literal(`TO_CHAR("Pedido"."createdAt", 'YYYY-MM-DD') LIKE '%${search}%'`);
    }
    return literal(`"Pedido"."${field}"::text ILIKE '%${search}%'`);
  });
};

function obtenerDinosaurio(detalles) {
  try {
    const [primeretalle] = detalles;
    return primeretalle.Hueso.Dinosaurio;
  } catch (error) {
    console.error('Error al obtener los detalles del pedido:', error);
    return null;
  }
}
module.exports = {
  getAllPedidos(args, opts = {}) {
    return models.Pedido.findAll({
      include: [models.Persona],
      where: {
        ...args,
      },
      order: [['createdAt', 'DESC']],
    });
  },
  countPedidos() {
    return models.Pedido.count();
  },
  getPedidos(page = 0, pageSize = 10, args) {
    return models.Pedido.findAll({
      include: [models.Persona],
      where: {
        ...args,
      },
      order: [['createdAt', 'DE9SC']],
      ...paginateModel({ page, pageSize }),
    });
  },
  async getPedidosDataTable({ start, length, search, order, columns }) {
    let querySearch = undefined;
    const [orderValue] = order;
    const columnOrder = columns[parseInt(orderValue.column)].data
      .split('.')
      .map(name => `"${name}"`)
      .join('.');

    if (search && search.length > MIN_CHARS) {
      const resultados = genericSearch(search, ['id', 'Dinosaurio.nombre']);
      console.log(resultados);
      querySearch = {
        [Op.or]: genericSearch(search, ['id', 'createdAt', 'motivo']),
      };
    }
    const pedidos = await models.Pedido.findAll({
      limit: length,
      offset: start,
      where: querySearch,
      include: [
        models.Persona,
        { model: models.Detalle, include: [{ model: models.Hueso, as: 'Hueso', include: [models.Dinosaurio] }] },
      ],
    });
    const pedidosJson = JSON.parse(JSON.stringify(pedidos));

    await Promise.all(
      pedidos.map(async (pedido, index) => {
        const estado = await pedido.estado;
        const dinosaurio = obtenerDinosaurio(pedido.Detalles);
        pedidosJson[index].estadoInstance = estado.constructor.name;
        pedidosJson[index].Dinosaurio = dinosaurio;
      })
    );
    return pedidosJson;
  },
  getPedido(args) {
    return models.Pedido.findOne({
      where: {
        ...args,
      },
      include: [
        models.Persona,
        {
          model: models.Empleado,
          include: models.Persona,
        },
        {
          model: models.Detalle,
        },
      ],
    });
  },
  obtenerPedido(id) {
    return models.Pedido.findByPk(id, { include: [persona] });
  },
  getPresupuestados() {
    return models.Pedido.findAll({
      where: {
        tipo: 'Externo',
        autorizacion: false,
      },
    });
  },
  solicitar(huesos) {
    return models.Pedido.create({
      autorizacion: true,
      tipo: INTERNO,
    }).then(pedido => {
      pedido.crearDetalles(huesos);
    });
  },
  presupuestar(huesos, cliente, descripcion, monto, fecha_fin_oferta, moneda) {
    //crea el pedido y sus detalles
    return models.Pedido.create({
      tipo: EXTERNO,
      PersonaId: cliente, //@TODO aca va cliente
      motivo: descripcion,
    }).then(async pedido => {
      //una vez que hayas creado el presupuesto
      //agregarle todos sus ddetalles
      pedido.crearDetalles(huesos);
      const estado = await pedido.estado;
      await estado.update({
        cantidad_huesos: huesos.length,
        monto,
        fecha_fin_oferta,
        moneda,
      });
    });
  },
  updatePedido(pedido) {
    return models.Pedido.upsert(pedido);
  },
  getReplicas(args, options = {}) {
    return models.Replica.findAll({
      where: {
        ...args,
      },
      include: [models.Hueso, models.Dinosaurio],
      ...options,
    });
  },
};
