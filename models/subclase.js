'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubClase = sequelize.define('SubClase', {
    nombre: DataTypes.STRING
  }, {});
  SubClase.associate = function(models) {
    // associations can be defined here
    models.SubClase.belongsTo(models.Clase);
  };
  return SubClase;
};