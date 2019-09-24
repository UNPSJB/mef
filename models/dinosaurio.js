'use strict';
module.exports = (sequelize, DataTypes) => {
  const Dinosaurio = sequelize.define('Dinosaurio', {
    activo: {
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:true
    },
    nombre: DataTypes.STRING,
    alimentacion : {
      type: DataTypes.ENUM,
      values: ['Herbivoro','Carnivoro','Omnivoro']
    },
    periodo : {
      type: DataTypes.ENUM,
      values: ['Cretacico','Jurasico','Triasico']
    },
    descubrimiento : DataTypes.DATEONLY
  });

  Dinosaurio.associate = function(models) {
    models.Dinosaurio.belongsTo(models.SubClase);
    models.Dinosaurio.hasMany(models.Hueso);
  };
  return Dinosaurio;
};