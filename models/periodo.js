'use strict';
module.exports = (sequelize, DataTypes) => {
  const Periodo = sequelize.define('Periodo', {
    nombre: DataTypes.STRING
  }, {});
  Periodo.associate = function(models) {
    // associations can be defined here
  };
  return Periodo;
};