'use strict';
const faker = require('faker');

const NUM_FOSSILS = 30;
const MAX_DINOSAUR_ID = 14;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const fossils = [];
    const huesos = ['Cráneo', 'Torax', 'Vertebral', 'Pelvis', 'Brazo', 'Manos', 'Piernas', 'Pies'];

    for (let i = 1; i <= NUM_FOSSILS; i++) {
      fossils.push({
        numero_coleccion: `FOS-${i.toString().padStart(4, '0')}`, // Genera un número de colección en formato FOS-0001, FOS-0002, etc.
        peso: faker.random.number({ min: 0, max: 200 }), // Genera un peso aleatorio entre 0 y 2000
        disponible: faker.random.boolean(), // Genera un valor booleano aleatorio
        fecha_encontrado: faker.date.between('1990-01-01', '2006-12-31').toISOString().slice(0, 10), // Fecha aleatoria entre 1990 y 2006
        observacion: '', // Campo observacion vacío
        huesos: faker.random.arrayElement(huesos), // Elige aleatoriamente un tipo de hueso
        DinosaurioId: faker.random.number({ min: 1, max: MAX_DINOSAUR_ID }), // Genera un DinosaurioId aleatorio entre 1 y MAX_DINOSAUR_ID
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Fosils', fossils, {});
  }
};
