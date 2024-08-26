'use strict';
const faker = require('faker/locale/es_MX');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const exhibicionesData = [
      {
        nombre: 'Fósiles de Dinosaurios',
        duracion: 6,
        tematica: 'Dinosaurios y Épocas Prehistóricas',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Replicas de Dinosaurios',
        duracion: 9,
        tematica: 'Dinosaurios y Épocas Prehistóricas',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Exhibición de Paleontología',
        duracion: 12,
        tematica: 'Dinosaurios y Épocas Prehistóricas',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Mundo Jurásico',
        duracion: 7,
        tematica: 'Dinosaurios y Épocas Prehistóricas',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Evolución de los Dinosaurios',
        duracion: 6,
        tematica: 'Dinosaurios y Épocas Prehistóricas',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Fósiles y Rastros de Dinosaurios',
        duracion: 9,
        tematica: 'Dinosaurios y Épocas Prehistóricas',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Dinosaurios en la Historia',
        duracion: 8,
        tematica: 'Dinosaurios y Épocas Prehistóricas',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Museo de Paleontología',
        duracion: 10,
        tematica: 'Dinosaurios y Épocas Prehistóricas',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Rastros del Pasado',
        duracion: 6,
        tematica: 'Dinosaurios y Épocas Prehistóricas',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Vida en el Jurásico',
        duracion: 8,
        tematica: 'Dinosaurios y Épocas Prehistóricas',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Insertar los datos en la tabla Exhibicions
    await queryInterface.bulkInsert('Exhibicions', exhibicionesData, {});

    // Continuación con la creación de visitas
    let visitasArr = [];
    let today = new Date();
    let startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    let daysInYear = 365;
    let totalVisits = 300; // número de visitas que se desea crear

    // Distribución de tipos de visitas
    let schoolVisits = Math.round(totalVisits * 0.54);
    let universityVisits = Math.round(totalVisits * 0.08);
    let privateVisits = Math.round(totalVisits * 0.12);
    let govOrganizationVisits = totalVisits - (schoolVisits + universityVisits + privateVisits);

    // Función para generar una fecha aleatoria entre el rango especificado
    const generateRandomDate = (start, end) => {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    // Generar visitas
    for (let i = 0; i < totalVisits; i++) {
      let visitaFecha;
      let visitaEstado;
      let visitaTipo;
      let exhibicionId = faker.random.number({ min: 1, max: exhibicionesData.length });

      // Asignar tipo de visita siguiendo una distribución
      if (schoolVisits > 0) {
        visitaTipo = 'Escuela';
        schoolVisits--;
      } else if (universityVisits > 0) {
        visitaTipo = 'Universidad';
        universityVisits--;
      } else if (privateVisits > 0) {
        visitaTipo = 'Particular';
        privateVisits--;
      } else {
        visitaTipo = 'Organización Gubernamental';
        govOrganizationVisits--;
      }

      do {
        visitaFecha = generateRandomDate(startDate, today);
        visitaEstado = faker.random.arrayElement(['Pendiente', 'Cancelada', 'Finalizada']);
      } while (
        visitaEstado === 'Pendiente' &&
        visitasArr.some(v => v.fechaVisita.toDateString() === visitaFecha.toDateString() && v.estado === 'Pendiente')
      );

      let visitaObj = {
        cantidadDePersonas: faker.random.number({ min: 1, max: 100 }),
        fechaVisita: visitaFecha,
        horario: faker.random.arrayElement([
          '09:00hs',
          '10:00hs',
          '11:00hs',
          '12:00hs',
          '13:00hs',
          '14:00hs',
          '15:00hs',
          '16:00hs',
          '17:00hs',
          '18:00hs',
        ]),
        precio: faker.random.number({ min: 1, max: 3000000 }),
        estado: visitaEstado,
        observacion: visitaTipo === 'Particular' ? null : `Visita solicitada por ${visitaTipo}`,
        cancelada: visitaEstado === 'Cancelada',
        createdAt: new Date(),
        updatedAt: new Date(),
        ClienteId: faker.random.number({ min: 1, max: 20 }),
        GuiumId: faker.random.number({ min: 1, max: 20 }),
        ExhibicionId: faker.random.number({ min: 1, max: 10 }),
      };

      visitasArr.push(visitaObj);
    }

    // Insertar los datos en la tabla Visitas
    return queryInterface.bulkInsert('Visita', visitasArr, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar todos los datos de la tabla Visitas
    await queryInterface.bulkDelete('Visita', null, {});

    // Eliminar todos los datos de la tabla Exhibicions
    return queryInterface.bulkDelete('Exhibicion', null, {});
  },
};
