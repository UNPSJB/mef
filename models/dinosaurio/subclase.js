'use strict'
module.exports = (sequelize, DataTypes) => {
  const SubClase = sequelize.define('SubClase', {
    descripcion: {
      type:DataTypes.STRING,
      allowNull:{
        args:false,
        msg:'La subclase debe tener nombre'
      },
      unique:{
        args:true,
        msg:'El nombre de subclase ya existe.'
      }
    },
    clase : {
      type: DataTypes.ENUM,
      allowNull:{
        args:false,
        msg:'La subclase debe tener asignada una clase.'
      },
      values: ["Saurisquio", "Ornitisquio"]
    },
  }, {
    paranoid:true
  })
  SubClase.associate = function(models) {
    models.SubClase.hasMany(models.Dinosaurio)
    models.Dinosaurio.belongsTo(models.SubClase)
  }
  return SubClase
}