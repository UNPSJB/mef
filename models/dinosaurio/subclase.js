'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubClase = sequelize.define('SubClase', {
    descripcion: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:{
        args:true, 
        msg: "El nombre de subclase ya existe."
      }
    },
    clase : {
      type: DataTypes.ENUM,
      allowNull:false,
      values: ["Saurisquio", "Ornitisquio"]
    },
  }, {});
  SubClase.associate = function(models) {
  };
  return SubClase;
};