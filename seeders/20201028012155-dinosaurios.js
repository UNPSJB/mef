'use strict';

const craneo = ['Paladar', 'Mandíbula', 'Cráneo'];

const pelvis = ['Coracoide', 'Ilion', 'Pubis', 'Ischion'];
const brazo = ['Radio', 'Unla', 'Húmero', 'Escápula'];
const piernas = ['Fémur', 'Tibia', 'Fíbula'];

const pies = ['Metatarsales', 'Dedos Pie'];
const manos = ['Metacarpianos', 'Dedos Mano'];
const vertebras = ['Hemales', 'Vertebras Cervicales', 'Vertebras Dorsales', 'Vertebras Sacras', 'Vertebras Caudales'];
const torso = ['Costillas Cervicales', 'Costillas Dorsales'];

const base = ['Pelvis', 'Brazo', 'Piernas', 'Pies', 'Manos', 'Vertebras', 'Torso'];

const huesosPersonalizados = ['Vertebras Cervicales', 'Vertebras Dorsales', 'Vertebras Sacras', 'Vertebras Caudales', 'Costillas Cervicales', 'Costillas Dorsales', 'Hemales', 'Metacarpianos', 'Metatarsales', 'Dedos Mano', 'Dedos Pie'];

const apendiculares = pelvis.concat(brazo).concat(piernas);


const faker = require('faker/locale/es_MX');


module.exports = {
  up: (queryInterface, Sequelize) => {

    let dinosaurioArr = [];
    const definirTipoSubtipo = (nombre) => {
      switch (nombre) {
        case 'Paladar':
        case 'Mandíbula':
        case 'Cráneo':
          return {
            tipohueso: 'Axial',
            subtipohueso: 'Cráneo'
          }
          break;
        case 'Coracoide':
        case 'Ilion':
        case 'Pubis':
        case 'Ischion':
        case 'Pelvis':
          return {
            tipohueso: 'Apendicular',
            subtipohueso: 'Pelvis'
          }
          break;
        case 'Radio':
        case 'Unla':
        case 'Húmero':
        case 'Escápula':
        case 'Brazo':
          return {
            subtipohueso: 'Brazo',
            tipohueso: 'Apendicular'
          }
          break;
        case 'Fémur':
        case 'Tibia':
        case 'Fíbula':
        case 'Piernas':
          return {
            subtipohueso: 'Piernas',
            tipohueso: 'Apendicular'
          }
          break;
        case 'Metatarsales':
        case 'Dedos Pie':
        case 'Pies':
          return {
            subtipohueso: 'Pies',
            tipohueso: 'Apendicular'
          }
          break;
        case 'Metacarpianos':
        case 'Dedos Mano':
        case 'Manos':
          return {
            tipohueso: 'Apendicular',
            subtipohueso: 'Manos'
          }
          break;
        case 'Hemales':
        case 'Vertebras Cervicales':
        case 'Vertebras Dorsales':
        case 'Vertebras Sacras':
        case 'Vertebras Caudales':
        case 'Vertebral':
        case 'Vertebras':
          return {
            subtipohueso: 'Vertebral',
            tipohueso: 'Axial'
          }
          break;
        case 'Costillas Cervicales':
        case 'Costillas Dorsales':
        case 'Torax':
        case 'Torso':
          return {
            subtipohueso: 'Torax',
            tipohueso: 'Axial'
          }
          break;
      }
    }
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

    let huesosArr = []



    //**En esta parte se crean los dinos */

    const nombresDinosaurios = [
      "Ankylosaurus",
      "Brachiosaurus",
      "Stegosaurus",
      "Pterodactyl",
      "Allosaurus",
      "Diplodocus",
      "Parasaurolophus",
      "Spinosaurus",
      "Velociraptor",
      "Triceratops",
      "Tyrannosaurus",
      "Archaeopteryx",
      "Iguanodon",
      "Microraptor",
      "Oviraptor",
    ];

    for (let index = 1; index <= nombresDinosaurios.length + 1; index++) {


      let dinosaurioObj = {
        nombre: nombresDinosaurios[index - 1],
        alimentacion: generarAlimentacion(),
        periodo: generarPeriodo(),
        descubrimiento: new Date(),
        SubClaseId: generarSubclase(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }

      dinosaurioArr.push(dinosaurioObj)

      /*  Estos son los objetos dinosaurio que tendría que probar después. Por ahora lo voy a dejar como está
          
      
      const dinos = [
            // 1)
            {
              nombre: 'Ankylosaurus',
              alimentación: 'Herbívoro',
              periodo: 'Cretácico',
              subclase: 'Ankylosauridae',
              descubrimiento: '12/11/1908',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
            // 2)
            {
              nombre: 'Brachiosaurus',
              alimentacion: 'Herbívoro',
              periodo: 'Jurásico',
              subclase: 'Brachiosauridae',
              descubrimiento: '12/12/1903',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
            // 3)
            {
              nombre: 'Stegosaurus',
              alimentacion: 'Herbívoro',
              periodo: 'Jurásico',
              subclase: 'Stegosauridae',
              descubrimiento: '12/08/1877',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
            // 4)
            {
              nombre: 'Pterodactylus',
              alimentacion: 'Carnívoro',
              periodo: 'Jurásico',
              subclase: 'Pterosauria',
              descubrimiento: '02/12/1784',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
      
            // 5)
            {
              nombre: 'Allosaurus',
              alimentacion: 'Carnívoro',
              periodo: 'Jurásico',
              subclase: 'Allosauridae',
              descubrimiento: '12/11/1877',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
      
            // 6)
            {
              nombre: 'Diplodocus',
              alimentacion: 'Herbívoro',
              periodo: 'Jurásico',
              subclase: 'Diplodocidae',
              descubrimiento: '03/04/1878',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
      
            // 7)
            {
              nombre: 'Parasaurolophus',
              alimentacion: 'Herbívoro',
              periodo: 'Cretácico',
              subclase: 'Hadrosauridae',
              descubrimiento: '12/10/1922',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
      
            // 8)
            {
              nombre: 'Spinosaurus',
              alimentacion: 'Carnívoro',
              periodo: 'Cretácico',
              subclase: 'Cretácico',
              descubrimiento: '10/12/1912',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
      
            // 9)
            {
              nombre: 'Velociraptor',
              alimentacion: 'Carnívoro',
              periodo: 'Cretácico',
              subclase: 'Dromaeosauridae',
              descubrimiento: '20/01/1923',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
      
            // 10)
            {
              nombre: 'Triceratops',
              alimentacion: 'Herbívoro',
              periodo: 'Cretácico',
              subclase: 'Ceratopsidae',
              descubrimiento: '12/02/1887',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
      
            // 11)
            {
              nombre: 'Tyrannosaurus rex',
              alimentacion: 'Carnívoro',
              periodo: 'Cretácico',
              subclase: 'Tyrannosauridae',
              descubrimiento: '12/08/1902',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
      
            // 12)
            {
              nombre: 'Archaeopteryx',
              alimentacion: 'Omnívoro',
              periodo: 'Jurásico',
              subclase: 'Avialae',
              descubrimiento: '12/06/1861',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
      
            // 13)
            {
              nombre: 'Iguanodon',
              alimentacion: 'Herbívoro',
              periodo: 'Cretácico',
              subclase: 'Iguanodontidae',
              descubrimiento: '12/11/1822',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
      
            // 14)
            {
              nombre: 'Microraptor',
              alimentacion: 'Carnívoro',
              periodo: 'Cretácico',
              subclase: 'Dromaeosauridae',
              descubrimiento: '30/08/2003',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
      
            // 15)
            {
              nombre: 'Oviraptor',
              alimentacion: 'Omnívoro',
              periodo: 'Cretácico',
              subclase: 'Oviraptoridae',
              descubrimiento: '12/01/1923',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
          ]*/

      /**************************************************** */

      base.forEach(nombre => {
        huesosArr.push({
          nombre,
          numero: 1,
          DinosaurioId: index,
          tipohueso: definirTipoSubtipo(nombre).tipohueso,
          subtipohueso: definirTipoSubtipo(nombre).subtipohueso,
          createdAt: new Date(),
          updatedAt: new Date()
        });

      })
      craneo.forEach((nombre) => {
        huesosArr.push({
          nombre, numero: 1,
          DinosaurioId: index,
          tipohueso: definirTipoSubtipo(nombre).tipohueso,
          subtipohueso: definirTipoSubtipo(nombre).subtipohueso,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
      for (var i = 1; i <= 2; i++) { //los que tienen solo dos    
        apendiculares.forEach((nombre) => {
          huesosArr.push({
            nombre,
            numero: i,
            DinosaurioId: index,
            tipohueso: definirTipoSubtipo(nombre).tipohueso,
            subtipohueso: definirTipoSubtipo(nombre).subtipohueso,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        });
      }
      for (const key in [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]) {//agrega por cada elemento de la lista huesos personalizados, la cantidad que llega para cada indice
        for (var j = 1; j <= [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1][key]; j++) {
          huesosArr.push({
            nombre: huesosPersonalizados[key],
            numero: j,
            DinosaurioId: index,
            tipohueso: definirTipoSubtipo(huesosPersonalizados[key]).tipohueso,
            subtipohueso: definirTipoSubtipo(huesosPersonalizados[key]).subtipohueso,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
      }

    }
    return queryInterface.bulkInsert('Dinosaurios', dinosaurioArr, {})
      .then(() => {
        return queryInterface.bulkInsert('Huesos', huesosArr, {});
      })
  },


  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Dinosaurios', null, {});
  }
};