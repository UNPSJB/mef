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
    descubrimiento : DataTypes.DATEONLY,
    SubClaseId:{
      type: DataTypes.INTEGER,
      references: {
        model: 'SubClases',//nombre en la tabla
        key:'id',        // id de la tabla SubClases
      }
    }
  });

  Dinosaurio.associate = function(models) {
    models.Dinosaurio.belongsTo(models.SubClase);
    models.Dinosaurio.hasMany(models.Hueso);
  };
  return Dinosaurio;
};