'use strict';
const MAX = 50;


module.exports = {
  up: (queryInterface, Sequelize) => {
    let canceladoArr = []


    for (let index = 1; index <= MAX; index++) {
      let canceladoObj = {
        fecha_baja: new Date(),
        obs: `Cancelado Observacion ${index}`,
        fecha: new Date(),
        descripcion: 'Cancelado',
        PedidoId: index,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }
      canceladoArr.push(canceladoObj)
    }
    return queryInterface.bulkInsert('Cancelados', canceladoArr, {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
