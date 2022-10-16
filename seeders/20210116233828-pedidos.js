'use strict';
const MAX = 300; //cantidad de dinosaurios
const faker = require('faker/locale/es_MX');
module.exports = {
  /* 
    Campos de Pedido: 
    Autorización boolean
    Motivo string
    Tipo enum    values : ['Interno','Externo']
    PersonaId integer
    */

  up: (queryInterface, Sequelize) => {
    let pedidoArr = [];
    for (let index = 1; index <= MAX; index++) {
      let pedidoObj = {
        autorizacion: true,
        motivo: '',
        tipo: index<=150? 'Externo' : 'Interno',
        PersonaId: index<=150? index : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }
      pedidoArr.push(pedidoObj)
    }
    return queryInterface.bulkInsert('Pedidos', pedidoArr, {})
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
