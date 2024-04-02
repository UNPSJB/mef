'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const MAX_PEDIDOS = 300; // Cantidad máxima de pedidos
    const MAX_DETALLES_POR_PEDIDO = 5; // Cantidad máxima de detalles por pedido

    const pedidos = [];
    const detalles = [];

    // Insertar registros en la tabla 'Pedidos'
    for (let pedidoId = 1; pedidoId <= MAX_PEDIDOS; pedidoId++) {
      const pedido = {
        autorizacion: true,
        motivo: '',
        tipo: pedidoId <= MAX_PEDIDOS / 2 ? 'Externo' : 'Interno',
        PersonaId: pedidoId <= MAX_PEDIDOS / 2 ? pedidoId : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      pedidos.push(pedido);
    }

    // Insertar registros en la tabla 'Detalles' y usar los IDs generados de 'Pedidos'
    for (let pedidoId = 1; pedidoId <= MAX_PEDIDOS; pedidoId++) {
      const numDetalles = Math.floor(Math.random() * (MAX_DETALLES_POR_PEDIDO - 2) + 2); // Número aleatorio entre 2 y 5

      for (let i = 0; i < numDetalles; i++) {
        const detalle = {
          cantidad: Math.floor(Math.random() * 10) + 1, // ID del hueso varía entre 1 y 10
          PedidoId: pedidoId,
          HuesoId: Math.floor(Math.random() * 9) + 1, // Cantidad de renglones del detalle varía entre 2 y 5
          renglon: i + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        detalles.push(detalle);
      }
    }

    // Insertar registros en la tabla 'Pedidos'
    await queryInterface.bulkInsert('Pedidos', pedidos, {});

    // Insertar registros en la tabla 'Detalles'
    return queryInterface.bulkInsert('Detalles', detalles, {});
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
