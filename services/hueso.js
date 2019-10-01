var models = require('../models');
let dino = models.Dinosaurio;
var hueso = models.Hueso;

const craneo = ['Paladar','Mandíbula','Cráneo'];

const pelvis = ['Coracoide','Ilion','Pubis','Ischion'];
const brazo = ['Radio','Unla','Húmero','Escápula'];
const piernas = ['Fémur','Tibia','Fíbula'];

const pies = ['Metatarsales','Dedos Pie'];
const manos = ['Metacarpianos','Dedos Mano'];
const vertebras = ['Hemales','Vertebras Cervicales','Vertebras Dorsales','Vertebras Sacras','Vertebras Caudales'];
const torso = ['Costillas Cervicales','Costillas Dorsales'];

const huesosPersonalizados = ['Vertebras Cervicales','Vertebras Dorsales','Vertebras Sacras','Vertebras Caudales','Costillas Cervicales','Costillas Dorsales','Hemales','Metacarpianos','Metatarsales','Dedos Mano','Dedos Pie'];


const apendiculares = pelvis.concat(brazo).concat(piernas);

module.exports = {
    getHuesos(){
        return hueso.findAll()
    },
    getAxiales(){
        console.log(axial);
    },
    getCraneo(){
        console.log(craneo);
    },
    getHueso(id){
        return hueso.findOne({
            where:{
                id
            }
        })
    },
    getHuesoDino(DinosaurioId){
        return hueso.findOne({
            where:{
                DinosaurioId
            }
        })
    },
    createHueso(nombre, numero, DinosaurioId){
        return hueso.create({
            nombre,
            numero,
            DinosaurioId
        });
    },
    createHuesos(DinosaurioId, args){
        craneo.forEach((nombre)=>{
            hueso.create({nombre,numero:1,DinosaurioId});            
        });
        for(var i=1;i<=2;i++){ //los que tienen solo dos    
            apendiculares.forEach((nombre)=>{
                hueso.create({
                    nombre, 
                    numero:i, 
                    DinosaurioId
                });
            });
        }
        for (const key in args) {//agrega por cada elemento de la lista huesos personalizados, la cantidad que llega para cada indice
            for (var index = 1; index <= args[key]; index++) {
                hueso.create({
                    nombre:huesosPersonalizados[key],
                    numero:index,
                    DinosaurioId
                })
            }
        }

    }
}