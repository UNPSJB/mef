'use strict';
module.exports = (sequelize, DataTypes) => {
  const Idioma = sequelize.define('Idioma', {
    nombre: DataTypes.STRING
  }, {});
  Idioma.associate = function(models) {
    // associations can be defined here
  };
  return Idioma;
};