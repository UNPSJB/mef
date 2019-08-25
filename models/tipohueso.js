'use strict';
module.exports = (sequelize, DataTypes) => {
  const TipoHueso = sequelize.define('TipoHueso', {
    nombre: DataTypes.STRING
  }, {});
  TipoHueso.associate = function(models) {
    // associations can be defined here
  };
  return TipoHueso;
};