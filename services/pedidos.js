const models = require('../models');
const INTERNO = 'Interno';
const EXTERNO = 'Externo';
const CONFIRMADO = 'Confirmado';
const PRESUPUESTADO = 'Presupuestado';
const { paginateModel } = require('./utils');

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
      order: [['createdAt', 'DESC']],
      ...paginateModel({ page, pageSize }),
    });
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
  async updateCantidadEmpleados(pedidoId) {
    try {
      // Busca el pedido por su ID junto con los empleados asociados
      const pedido = await models.Pedido.findByPk(pedidoId, {
        include: [{ model: models.Empleado }],
      });

      if (!pedido) {
        throw new Error('El pedido no existe');
      }

      // Extrae la lista de empleados asociados al pedido y cuenta su longitud
      const cantidadEmpleados = pedido.Empleados.length;

      // Actualiza el valor de cantidad_empleados en la tabla fabricandos
      const fabricando = await pedido.getFabricando();
      if (fabricando) {
        if (fabricando.cantidad_empleados !== cantidadEmpleados) {
          // Actualiza el valor de cantidad_empleados en la tabla fabricandos
          await fabricando.update({ cantidad_empleados: cantidadEmpleados });
        }
      } else {
        throw new Error('No se encontró el estado de fabricando para el pedido');
      }
    } catch (error) {
      console.error('Error al contar la cantidad de empleados en el pedido:', error);
      throw error;
    }
  },
};
