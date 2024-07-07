'use strict';

const MAX_PEDIDOS = 300; // Cantidad máxima de pedidos
const MAX_DETALLES_POR_PEDIDO = 5; // Cantidad máxima de detalles por pedido

function getRandomDateWithinFourMonths() {
  const currentDate = new Date();
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(currentDate.getMonth() - 4);
  const randomTime = Math.random() * (currentDate.getTime() - fourMonthsAgo.getTime());
  return new Date(fourMonthsAgo.getTime() + randomTime);
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const pedidos = [];
    const detalles = [];
    const pedidosDates = []; // Array para guardar las fechas generadas

    // Insertar registros en la tabla 'Pedidos'
    for (let pedidoId = 1; pedidoId <= MAX_PEDIDOS; pedidoId++) {
      const randomDate = getRandomDateWithinFourMonths();
      const pedido = {
        autorizacion: true,
        motivo: '',
        tipo: pedidoId <= MAX_PEDIDOS / 2 ? 'Externo' : 'Interno',
        PersonaId: pedidoId <= MAX_PEDIDOS / 2 ? pedidoId : null,
        createdAt: randomDate,
        updatedAt: randomDate,
        deletedAt: null,
      };
      pedidos.push(pedido);
      pedidosDates.push(randomDate); // Guardar la fecha generada
    }

    // Insertar registros en la tabla 'Detalles' y usar los IDs generados de 'Pedidos'
    for (let pedidoId = 1; pedidoId <= MAX_PEDIDOS; pedidoId++) {
      const numDetalles = Math.floor(Math.random() * (MAX_DETALLES_POR_PEDIDO - 2) + 2); // Número aleatorio entre 2 y 5

      for (let i = 0; i < numDetalles; i++) {
        const randomDate = getRandomDateWithinFourMonths();
        const detalle = {
          cantidad: Math.floor(Math.random() * 10) + 1,
          PedidoId: pedidoId,
          HuesoId: Math.floor(Math.random() * 9) + 1,
          renglon: i + 1,
          createdAt: randomDate,
          updatedAt: randomDate,
        };
        detalles.push(detalle);
      }
    }

    // Insertar registros en la tabla 'Pedidos'
    await queryInterface.bulkInsert('Pedidos', pedidos, {});

    // Insertar registros en la tabla 'Detalles'
    await queryInterface.bulkInsert('Detalles', detalles, {});

    // Devolver las fechas generadas para ser usadas en el próximo seeder
    return pedidosDates;
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
