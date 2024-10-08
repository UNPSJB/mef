'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Confirmado extends Sequelize.Model {
    async fabricar(pedido, args) {
      const { fechainicio, fechafin, empleado } = args;
      let empleados = [];
      if (empleado != null) Array.isArray(empleado) ? (empleados = empleado) : empleados.push(empleado);
      const descripcion = 'Fabricando';
      const inicio_estimada = fechainicio;
      const fin_estimada = fechafin;
      const cantidad_empleados = empleados.length;
      const PedidoId = pedido.id;
      const nuevoEstadoFabricando = await sequelize.models.Fabricando.create({
        PedidoId,
        fecha: new Date(),
        descripcion,
        cantidad_empleados,
        inicio_estimada,
        fin_estimada,
      });
      Promise.all(
        empleados.map(async empleadoId => {
          const empleado = await sequelize.models.Empleado.findByPk(empleadoId);
          return empleado.asignarAPedido(PedidoId, empleado.id);
        })
      );
      return nuevoEstadoFabricando;
    }
    cancelar(pedido, args) {
      const PedidoId = pedido.id;
      console.log('pedido', pedido, 'args', args);
      return sequelize.models.Cancelado.create({
        PedidoId,
        obs: args.observacion,
      });
    }
  }

  Confirmado.init(
    {
      descripcion: {
        type: DataTypes.STRING,
        defaultValue: 'Confirmado',
      },
      fecha: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false,
      },
      PedidoId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Pedidos',
          key: 'id',
        },
      },
    },
    {
      paranoid: true,
      sequelize,
      indexes: [
        {
          fields: ['PedidoId'],
        },
      ],
    }
  );
  Confirmado.associate = function (models) {
    models.Confirmado.belongsTo(models.Pedido);
  };
  return Confirmado;
};
