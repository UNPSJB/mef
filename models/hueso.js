'use strict';
module.exports = (sequelize, DataTypes) => {
  const Hueso = sequelize.define('Hueso', {
    nombre: DataTypes.STRING
  }, {});
  Hueso.associate = function(models) {
    // associations can be defined here
    models.Hueso.belongsTo(models.Dinosaurio);
    models.Hueso.belongsTo(models.SubTipoHueso);
  };
  return Hueso;
};