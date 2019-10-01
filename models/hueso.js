'use strict';
module.exports = (sequelize, DataTypes) => {
  const axial = ['Torax','Vertebral','Craneo'];
  const apendicular = ['Pelvis','Brazo','Manos','Piernas','Pies'];

  const Hueso = sequelize.define('Hueso', {
    nombre: DataTypes.STRING,
    numero: DataTypes.INTEGER,
    subtipohueso: {
      allowNull : false,
      type: DataTypes.ENUM,
      values: ['Torax','Vertebral','Craneo','Pelvis','Brazo','Manos','Piernas','Pies']
    },
    tipohueso: {
      type: DataTypes.ENUM,
      values: ['Apendicular','Axial']
    },
    disponible: {
      type: DataTypes.ENUM,
      values: ['SI','NO'],
      defaultValue: 'NO',
    },
    DinosaurioId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Dinosaurios',//nombre en la tabla
        key:'id',        // id de la tabla SubClases
      }
    }
  }, {
    hooks:{
      afterValidate: (hueso) =>{
        if(axial.some( (item) => {return item === hueso.subtipohueso})){
          // es hueso axial
          hueso.tipohueso = 'Apendicular';
        }
        if(apendicular.some( (item) => {return item === hueso.subtipohueso})){
          //es hueso apendicular
          hueso.tipohueso = 'Axial';
        }
      }
    }
  });
  Hueso.associate = function(models) {
    models.Hueso.belongsTo(models.Dinosaurio);
  };
  return Hueso;
};