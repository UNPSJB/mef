'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Entregado extends Sequelize.Model {}
  Entregado.init(
    {
      fecha_envio: DataTypes.DATEONLY,
      fecha_entrega: DataTypes.DATEONLY, //fecha definitiva de creado, la pone el cliente
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
  Entregado.associate = function (models) {
    models.Entregado.belongsTo(models.Pedido);
  };
  return Entregado;
};
