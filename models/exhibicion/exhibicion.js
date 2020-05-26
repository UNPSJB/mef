"use strict";
module.exports = (sequelize, DataTypes) => {
  const FosilExhibicion = sequelize.define('FosilExhibicion',{},{ paranoid:true })
  const ReplicaExhibicion = sequelize.define('ReplicaExhibicion',{},{ paranoid:true })
  const Exhibicion = sequelize.define("Exhibicion", {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Ese nombre de exhibicion ya existe!"
      }
    },
    duracion:{
      type:DataTypes.STRING,
      allowNull: false
    },
    tematica:{
      type:DataTypes.STRING, 
      allowNull: false
    }
  }, {
    paranoid:true
  });
  Exhibicion.associate = function(models){
    models.Exhibicion.belongsToMany(models.Replica,{
        through:ReplicaExhibicion
    });
    models.Exhibicion.belongsToMany(models.Fosil,{
        through:FosilExhibicion
    });
    models.Replica.belongsToMany(models.Exhibicion,{
        through:ReplicaExhibicion
    });
    models.Fosil.belongsToMany(models.Exhibicion,{
        through:FosilExhibicion
    });
  }
  return Exhibicion;
};
