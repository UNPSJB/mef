'use strict';
const MAX = 500; //cantidad de personas
const faker = require('faker/locale/es_MX');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let peopleArr = [];
    let guiaArr = [];
    let idiomaArr = [];
    let clientesArr = [];
    let empleadosArr = [];
    let today = new Date();
    let minDate = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate());
    let maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    //generar personas
    for (let index = 0; index < MAX; index++) {
      //let fakeId = Math.round(Math.random() * 1000000 * 99) + 1000000; //entre 1 y 100 millones
      let fakeId = Math.round(Math.random() * (50000000 - 14000000)) + 14000000; //entre 14 millones y 50 millones.
      let fecha_nacimiento = faker.date.between(minDate, maxDate);
      let peopleObj = {
        identificacion: fakeId,
        nombre: faker.name.firstName(),
        apellido: faker.name.lastName(),
        direccion: faker.address.streetAddress(),
        localidad: faker.address.city(),
        email: faker.internet.email(),
        fecha_nacimiento: fecha_nacimiento,
        telefono: faker.phone.phoneNumber(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      peopleArr.push(peopleObj);
    }

    //generar guias
    for (let index = 1; index < 100; index++) {
      let guiaObj = {
        PersonaId: index,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      //generar idiomas que habla
      let cantidadIdiomas = Math.round(Math.random() * 5) + 1; //entre 1 y 6
      for (let index2 = 1; index2 <= cantidadIdiomas; index2++) {
        const idiomaObj = {
          createdAt: new Date(),
          updatedAt: new Date(),
          IdiomaId: index2,
          GuiumId: index,
        };
        idiomaArr.push(idiomaObj);
      }
      guiaArr.push(guiaObj);
    }
    //generar clientes
    for (let index = 101; index < 400; index++) {
      let random = Math.round(Math.random());
      let tipoCliente = random ? 'Particular' : 'Institucional';
      let clienteObj = {
        tipo: tipoCliente,
        PersonaId: index,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      clientesArr.push(clienteObj);
    }
    for (let index = 401; index <= 500; index++) {
      const empleadoObj = {
        PersonaId: index,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      empleadosArr.push(empleadoObj);
    }
    return queryInterface.bulkInsert('Personas', peopleArr, {}).then(e => {
      return queryInterface.bulkInsert('Guia', guiaArr, {}).then(f => {
        return queryInterface.bulkInsert('IdiomaGuia', idiomaArr, {}).then(g => {
          return queryInterface.bulkInsert('Clientes', clientesArr, {}).then(h => {
            return queryInterface.bulkInsert('Empleados', empleadosArr, {});
          });
        });
      });
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Personas', null, {});
  },
};
