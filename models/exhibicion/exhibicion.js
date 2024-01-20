'use strict';
module.exports = (sequelize, DataTypes) => {
  const FosilExhibicion = sequelize.define('FosilExhibicion',{},{})
  const ReplicaExhibicion = sequelize.define('ReplicaExhibicion',{},{})
  const Exhibicion = sequelize.define('Exhibicion', {
    /** @TODO AGREGAR VALIDACION DE LARGO */
    nombre: {
      type: DataTypes.STRING,
      allowNull: {
        args:false,
        msg:'La exhibición debe tener nombre.'
      },
    },
    duracion:{
      type:DataTypes.STRING,
      allowNull: {
        args:false,
        msg:'La exhibición debe tener duración.'
      }
    },
    tematica:{
      type:DataTypes.STRING, 
      allowNull: {
        args:false,
        msg:'La exhibición debe tener tematica.'
      }
    }
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
