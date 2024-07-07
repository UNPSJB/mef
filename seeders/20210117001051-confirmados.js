'use strict';
const MAX = 300;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Pedido = queryInterface.sequelize.define(
      'Pedido',
      {
        createdAt: {
          type: Sequelize.DATE,
        },
      },
      {
        tableName: 'Pedidos',
        timestamps: false,
      }
    );

    const pedidos = await Pedido.findAll({
      attributes: ['id', 'createdAt'],
      where: {
        id: {
          [Sequelize.Op.lte]: MAX,
        },
      },
    });

    let confirmadoArr = pedidos.map(pedido => ({
      descripcion: 'Confirmado',
      fecha: new Date(),
      PedidoId: pedido.id,
      createdAt: pedido.createdAt,
      updatedAt: new Date(),
      deletedAt: null,
    }));

    return queryInterface.bulkInsert('Confirmados', confirmadoArr, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
