'use strict';
const MAX = 300; //cantidad de dinosaurios
const faker = require('faker/locale/es_MX');
module.exports = {
  up: (queryInterface, Sequelize) => {

    let dinosaurioArr = [];
    const generarSubclase = () => {
      return Math.round(Math.random() * 6) + 1;
    }
    const generarAlimentacion = () => {
      const alimentacion = ['Herbivoro', 'Carnivoro', 'Omnivoro']
      return alimentacion[Math.round(Math.random() * 2)];
    }
    const generarPeriodo = () => {
      const periodo = ['Cretacico', 'Jurasico', 'Triasico']
      return periodo[Math.round(Math.random() * 2)];
    }

    for (let index = 1; index <= MAX; index++) {
      let dinosaurioObj = {
        nombre: faker.commerce.productName() + 'saurus ' + index,
        alimentacion: generarAlimentacion(),
        periodo: generarPeriodo(),
        descubrimiento: new Date(),
        SubClaseId: generarSubclase(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }
      dinosaurioArr.push(dinosaurioObj)


    }
    return queryInterface.bulkInsert('Dinosaurios', dinosaurioArr, {})
  },


  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Dinosaurios', null, {});
  }
};