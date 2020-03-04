'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Idiomas',[
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Inglés​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Chino mandarín​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Hindi​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Español​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Francés​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Árabe'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Bengalí​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Ruso​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Portugués​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Indonesio​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Urdu​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Alemán​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Japonés​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Panyabí occidental'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Javanés​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Chino Wu'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Telugú​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Turco'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Coreano'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Maratí​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Tamil​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Chino cantonés'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Vietnamita'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Italiano​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Hausa​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Tailandés​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Persa iraní​'
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        nombre:'Chino Mǐn Nán'
    },
    ])
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
