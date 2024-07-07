'use strict';
const MAX = 50;
const START_ID = 151;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define el modelo Pedido
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

    // Obtén los pedidos a partir del id 151 hasta 200
    const pedidos = await Pedido.findAll({
      attributes: ['id', 'createdAt'],
      where: {
        id: {
          [Sequelize.Op.gte]: START_ID,
          [Sequelize.Op.lt]: START_ID + MAX,
        },
      },
    });

    // Construye el array canceladoArr
    let canceladoArr = pedidos.map((pedido, index) => ({
      fecha_baja: new Date(),
      obs: `Cancelado Observacion ${START_ID + index}`,
      fecha: new Date(),
      descripcion: 'Cancelado',
      PedidoId: pedido.id,
      createdAt: pedido.createdAt,
      updatedAt: new Date(),
      deletedAt: null,
    }));

    // Inserta en la tabla Cancelados
    return queryInterface.bulkInsert('Cancelados', canceladoArr, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Agrega comandos de reversión aquí.
      Retorna una promesa para manejar la asincronía correctamente.

      Ejemplo:
      return queryInterface.bulkDelete('Cancelados', null, {});
    */
  },
};
