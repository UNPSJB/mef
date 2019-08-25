'use strict';
module.exports = (sequelize, DataTypes) => {
  const Alimentacion = sequelize.define('Alimentacion', {
    nombre: DataTypes.STRING
  }, {});
  Alimentacion.associate = function(models) {
    // associations can be defined here
  };
  return Alimentacion;
};