const models = require('../models');

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

module.exports = {
  getHuesos() {
    return models.Hueso.findAll({ include: [models.Dinosaurio] })
  },
  getHueso(id) {
    return models.Hueso.findOne({
      include: [models.Dinosaurio],
      where: {
        id
      }
    })
  },
  getHuesosDinoArgs(DinosaurioId, args){
    return models.Hueso.findAll({
      where: {
        DinosaurioId,
        ...args
      }, raw:true,
      order: [
        ['disponible', 'DESC']
      ]
    })    
  },
  getHuesosDino(DinosaurioId) {
    return models.Hueso.findAll({
      where: {
        DinosaurioId
      }, raw:true
    })
  },
  getHuesoDino(DinosaurioId, subtipohueso) {
    return models.Hueso.findOne({
      where: {
        DinosaurioId, subtipohueso
      }
    })
  }
  ,
  createHueso(nombre, numero, DinosaurioId) {
    return models.Hueso.create({
      nombre,
      numero,
      DinosaurioId
    });
  },
  createHuesos(DinosaurioId, args) {
    base.forEach(nombre => {
      models.Hueso.create({ nombre, numero: 1, DinosaurioId });
    })
    craneo.forEach((nombre) => {
      models.Hueso.create({ nombre, numero: 1, DinosaurioId });
    });
    for (var i = 1; i <= 2; i++) { //los que tienen solo dos    
      apendiculares.forEach((nombre) => {
        models.Hueso.create({
          nombre,
          numero: i,
          DinosaurioId
        });
      });
    }
    for (const key in args) {//agrega por cada elemento de la lista huesos personalizados, la cantidad que llega para cada indice
      for (var index = 1; index <= args[key]; index++) {
        models.Hueso.create({
          nombre: huesosPersonalizados[key],
          numero: index,
          DinosaurioId
        })
      }
    }

  },
  toggleDisponibilidadHueso(id) {
    models.Hueso.findOne({
      where: {
        id
      }
    }).then((found) => {
      models.Hueso.update({
        disponible: !found.disponible
      }, {
        where: {
          id: found.id
        }
      })

    });
  }
}