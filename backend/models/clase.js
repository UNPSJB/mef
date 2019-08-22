'use strict';
module.exports = (sequelize, DataTypes) => {
  const Clase = sequelize.define('Clase', {
    nombre: DataTypes.STRING
  }, {});
  Clase.associate = function(models) {
  };
  return Clase;
};