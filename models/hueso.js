'use strict';
module.exports = (sequelize, DataTypes) => {
  const Hueso = sequelize.define('Hueso', {
    nombre: DataTypes.STRING,
    subtipohueso: {
      type: DataTypes.ENUM,
      values: ['Torax','Vertebral','Craneo','Pelvis','Brazo','Manos','Piernas','Pies']
    },
    tipohueso: {
      type: DataTypes.ENUM,
      values: ['Apendicular','Axial']
    }
  }, {});
  Hueso.associate = function(models) {
    models.Hueso.belongsTo(models.Dinosaurio);
  };
  return Hueso;
};