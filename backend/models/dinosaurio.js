'use strict';
module.exports = (sequelize, DataTypes) => {
  const Dinosaurio = sequelize.define('Dinosaurio', {
    nombre: DataTypes.STRING
  });

  Dinosaurio.associate = function(models) {
    // associations can be defined here
    models.Dinosaurio.belongsTo(models.Clase);
  };
  return Dinosaurio;
};