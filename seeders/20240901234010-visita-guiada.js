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
    let visitasArr = [];
    let today = new Date();
    let startDate = new Date(today.getFullYear() - 4, 0, 1); // Inicio de hace 4 años (2020)
    let endDate = new Date(today.getFullYear(), 11, 31); // Fin del año actual (2024)
    let totalVisits = 600; // número de visitas que se desea crear
    let additionalVisits = 80; // número de visitas adicionales

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
          let visitaEstado = faker.random.arrayElement(['Cancelada', 'Finalizada', 'Pendiente']);
          let visitaTipo = faker.random.arrayElement(['Escuela', 'Universidad', 'Particular', 'Organización Gubernamental']);
          let exhibicionId = faker.random.number({ min: 1, max: exhibicionesData.length });

          let visitaObj = {
            cantidadDePersonas: faker.random.number({ min: 1, max: 100 }),
            fechaVisita: visitaFecha,
            horario: faker.random.arrayElement([
              '09:00hs', '10:00hs', '11:00hs', '12:00hs', '13:00hs',
              '14:00hs', '15:00hs', '16:00hs', '17:00hs', '18:00hs'
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

    // Agregar visitas adicionales en estado "Pendiente"
    for (let i = 0; i < additionalVisits; i++) {
      let visitaFecha;
      let visitaTipo = faker.random.arrayElement(['Escuela', 'Universidad', 'Particular', 'Organización Gubernamental']);
      let futureYear = today.getFullYear(); // Año actual para visitas adicionales
      let futureMonth = Math.floor(Math.random() * 12); // Mes aleatorio del año

      let futureStartDate = new Date(futureYear, futureMonth, 1);
      let futureEndDate = new Date(futureYear, futureMonth + 1, 0);

      do {
        visitaFecha = generateRandomDate(futureStartDate, futureEndDate);
      } while (
        visitasArr.some(v => v.fechaVisita.toDateString() === visitaFecha.toDateString() && v.estado === 'Pendiente')
      );

      let visitaObj = {
        cantidadDePersonas: faker.random.number({ min: 1, max: 100 }),
        fechaVisita: visitaFecha,
        horario: faker.random.arrayElement([
          '09:00hs', '10:00hs', '11:00hs', '12:00hs', '13:00hs',
          '14:00hs', '15:00hs', '16:00hs', '17:00hs', '18:00hs'
        ]),
        precio: faker.random.number({ min: 1, max: 30000 }),
        estado: 'Pendiente', // Estado siempre "Pendiente"
        observacion: visitaTipo === 'Particular' ? null : `Visita solicitada por ${visitaTipo}`,
        cancelada: false, // Estado "Pendiente" no puede estar cancelado
        createdAt: new Date(),
        updatedAt: new Date(),
        ClienteId: faker.random.number({ min: 1, max: 50 }), // Ajustado al rango válido
        GuiumId: faker.random.number({ min: 1, max: 60 }),
        ExhibicionId: faker.random.number({ min: 1, max: 8 }),
      };

      visitasArr.push(visitaObj);
    }

    // Ordenar visitas por fecha
    visitasArr.sort((a, b) => a.fechaVisita - b.fechaVisita);

    // Insertar los datos en la tabla Visitas
    return queryInterface.bulkInsert('Visita', visitasArr, {});
  },
};
