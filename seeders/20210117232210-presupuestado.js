'use strict';
const MAX = 150;

module.exports = {
  up: (queryInterface, Sequelize) => {
    let presupuestadoArr = []

    const generarMoneda = () => {
      const moneda = ['Pesos Argentinos', 'Dolares','Euros']
      return moneda[Math.round(Math.random() * 2)]
    }
    for (let index = 1; index <= MAX; index++) {
      let presupuestadoObj = {
        descripcion: 'Presupuestado',
        fecha: new Date(),
        cantidad_huesos: 43,
        monto: Math.round(Math.random() * 20000)+1000,
        moneda: generarMoneda(),
        // TODO fijarse si ponemos fechas vencidas o en el futuro
        fecha_fin_oferta: new Date(),
        PedidoId: index,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }
      presupuestadoArr.push(presupuestadoObj)
    }
    return queryInterface.bulkInsert('Presupuestados', presupuestadoArr, {})
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
