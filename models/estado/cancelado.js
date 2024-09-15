'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cancelado extends Sequelize.Model {
    reanudar() {}
  }
  Cancelado.init(
    {
      fecha_baja: DataTypes.DATEONLY,
      obs: DataTypes.STRING,
      fecha: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.STRING,
        defaultValue: 'Cancelado',
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

  return Cancelado;
};
