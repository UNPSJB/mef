'use strict';
const faker = require('faker/locale/es_MX');

// Función para generar un conjunto de números únicos
const getRandomUniqueNumbers = (min, max, count) => {
  const numbers = new Set();
  while (numbers.size < count) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(num);
  }
  return Array.from(numbers);
};

// Función para generar un número aleatorio entre dos valores
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const NUM_FOSSILS = 30;
const MAX_DINOSAUR_ID = 14;
const NUM_EXHIBICIONES = 10;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Datos de exhibiciones
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

    /** ----------------------------------------------------------------------------------- */

    // Generar 30 números únicos para los IDs de los fósiles
    const fosiles = getRandomUniqueNumbers(1, 29, 29);

    // Crear las relaciones entre exhibiciones y fósiles
    const fosilExhibicionesData = [];
    for (let i = 0; i < exhibicionesData.length; i++) {
      const numFosiles = getRandomInt(1, 2);
      const selectedFosiles = getRandomUniqueNumbers(0, fosiles.length - 1, numFosiles);

      selectedFosiles.forEach(index => {
        fosilExhibicionesData.push({
          ExhibicionId: i + 1, // Usar el índice + 1 para el ID
          FosilId: fosiles[index],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    }

    // Insertar las relaciones en la tabla intermedia
    await queryInterface.bulkInsert('FosilExhibicions', fosilExhibicionesData, {});

    /** ----------------------------------------------------------------------------------- */

    let visitasArr = [];
    let today = new Date();
    let startDate = new Date(today.getFullYear() - 4, 0, 1); // Inicio de hace 4 años (2020)
    let endDate = new Date(today.getFullYear(), 11, 31); // Fin del año actual (2024)
    let totalVisits = 600; // número de visitas que se desea crear

    // Función para generar una fecha aleatoria entre el rango especificado
    const generateRandomDate = (start, end) => {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    // Generar visitas para cada mes entre 2020 y 2024
    for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
      for (let month = 0; month < 12; month++) {
        let visitasPorMes = Math.floor(totalVisits / (12 * (endDate.getFullYear() - startDate.getFullYear() + 1))); // Número base de visitas por mes
        let monthStartDate = new Date(year, month, 1);
        let monthEndDate = new Date(year, month + 1, 0); // Fin del mes

        for (let i = 0; i < visitasPorMes; i++) {
          let visitaFecha = generateRandomDate(monthStartDate, monthEndDate);

          // Determinar el estado de la visita basado en la fecha
          let visitaEstado;
          if (visitaFecha < today) {
            visitaEstado = faker.random.arrayElement(['Cancelada', 'Finalizada']);
          } else {
            visitaEstado = faker.random.arrayElement(['Pendiente', 'Cancelada']);
          }

          let visitaTipo = faker.random.arrayElement(['Escuela', 'Universidad', 'Particular', 'Organización Gubernamental']);
          let exhibicionId = faker.random.number({ min: 1, max: exhibicionesData.length });

          let visitaObj = {
            cantidadDePersonas: faker.random.number({ min: 1, max: 100 }),
            fechaVisita: visitaFecha,
            horario: faker.random.arrayElement([
              '09:00hs', '10:00hs', '11:00hs', '12:00hs', '13:00hs',
              '14:00hs', '15:00hs', '16:00hs', '17:00hs', '18:00hs',
            ]),
            precio: faker.random.number({ min: 1, max: 30000 }),
            estado: visitaEstado,
            observacion: visitaTipo === 'Particular' ? null : `Visita solicitada por ${visitaTipo}`,
            cancelada: visitaEstado === 'Cancelada',
            createdAt: new Date(),
            updatedAt: new Date(),
            ClienteId: faker.random.number({ min: 1, max: 50 }), // Ajustado al rango válido
            GuiumId: faker.random.number({ min: 1, max: 60 }),
            ExhibicionId: exhibicionId,
          };

          visitasArr.push(visitaObj);
        }
      }
    }

    // Ordenar el array de visitas por la fecha de visita de manera ascendente
    visitasArr.sort((a, b) => new Date(a.fechaVisita) - new Date(b.fechaVisita));

    // Insertar visitas en la tabla
    await queryInterface.bulkInsert('Visita', visitasArr, {});
  },
};
