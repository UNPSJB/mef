'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubClase = sequelize.define('SubClase', {
    nombre: {
      type:DataTypes.STRING,
      allowNull:false
    },
    clase : {
      type: DataTypes.ENUM,
      allowNull:false,
      values: ["Saurisquio", "Ornitisquio"]
    }
  }, {});
  SubClase.associate = function(models) {
  };
  return SubClase;
};