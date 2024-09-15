'use strict';
module.exports = (sequelize, DataTypes) => {
  const Detalle = sequelize.define(
    'Detalle',
    {
      renglon: DataTypes.STRING,
      cantidad: DataTypes.INTEGER,
      PedidoId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Pedidos',
          key: 'id',
        },
      },
      HuesoId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Huesos',
          key: 'id',
        },
      },
    },
    {
      paranoid: true,
      indexes: [
        {
          fields: ['PedidoId'],
        },
        {
          fields: ['HuesoId'],
        },
      ],
    }
  );
  //Detalle.associate = models => {
  //Detalle.belongsTo(models.Pedido);
  //Detalle.belongsTo(models.Hueso, { as: 'Hueso', foreignKey: 'HuesoId' });
  //};
  return Detalle;
};
