'use strict';
module.exports = (sequelize, DataTypes) => {
  const Hueso = sequelize.define('Hueso', {
    nombre: DataTypes.STRING,
    numero: DataTypes.INTEGER,
    subtipohueso: {
      type: DataTypes.ENUM,
      values: ['Torax','Vertebral','Craneo','Pelvis','Brazo','Manos','Piernas','Pies']
    },
    tipohueso: {
      type: DataTypes.ENUM,
      values: ['Apendicular','Axial']
    },
    disponible: {
      type: DataTypes.ENUM,
      values: ['SI','NO']
    },
    DinosaurioId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Dinosaurios',//nombre en la tabla
        key:'id',        // id de la tabla SubClases
      }
    }
  }, {});
  Hueso.associate = function(models) {
    models.Hueso.belongsTo(models.Dinosaurio);
  };
  return Hueso;
};