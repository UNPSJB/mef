"use strict";
module.exports = (sequelize, DataTypes) => {
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
  });
  Exhibicion.associate = function(models){
    models.Exhibicion.belongsToMany(models.Replica,{
        through:'ReplicaExhibicion'
    });
    models.Exhibicion.belongsToMany(models.Fosil,{
        through:'FosilExhibicion'
    });
    models.Replica.belongsToMany(models.Exhibicion,{
        through:'ReplicaExhibicion'
    });
    models.Fosil.belongsToMany(models.Exhibicion,{
        through:'FosilExhibicion'
    });
  }
  return Exhibicion;
};
