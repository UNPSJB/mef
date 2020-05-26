'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubClase = sequelize.define('SubClase', {
    descripcion: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:{
        args:true,
        msg:"La subclase ya existe!"
      }
    },
    clase : {
      type: DataTypes.ENUM,
      allowNull:false,
      values: ["Saurisquio", "Ornitisquio"]
    },
  }, {
    paranoid:true
  });
  SubClase.associate = function(models) {
  };
  return SubClase;
};