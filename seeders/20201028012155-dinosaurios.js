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

    for (let index = 1; index <= nombresDinosaurios.length+1; index++) {


      let dinosaurioObj = {
        nombre: nombresDinosaurios[index-1],
        alimentacion: generarAlimentacion(),
        periodo: generarPeriodo(),
        descubrimiento: new Date(),
        SubClaseId: generarSubclase(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }

      dinosaurioArr.push(dinosaurioObj)

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