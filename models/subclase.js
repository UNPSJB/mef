'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubClase = sequelize.define('SubClase', {
    nombre : DataTypes.STRING,
    clase : {
      type: DataTypes.ENUM,
      values: ["Saurisquio", "Ornitisquio"]
    }
  }, {});
  SubClase.associate = function(models) {
  };
  return SubClase;
};