'use strict';
module.exports = (sequelize, DataTypes) => {
  const Dinosaurio = sequelize.define('Dinosaurio', {
    nombre: DataTypes.STRING
  });

  Dinosaurio.associate = function(models) {
    // associations can be defined here
    models.Dinosaurio.belongsTo(models.SubClase);
    models.Dinosaurio.belongsTo(models.Alimentacion);
    models.Dinosaurio.belongsTo(models.Periodo);
    models.Dinosaurio.hasMany(models.Hueso);
  };
  return Dinosaurio;
};