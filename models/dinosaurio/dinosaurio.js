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
  },{
    hooks:{
      afterValidate: (dinosaurio) => {
        /*
        Torax
        Vertebral
        Craneo
          Cráneo
          Paladar
          Mandíbula

        Pelvis
          Coracoide
          Coracoide
          Ilion
          Ilion
          Pubis
          Pubis          
          Ischion
          Ischion          

        Brazo
          Radio
          Radio
          Unla
          Unla          
          Húmero
          Húmero
          Escápula
          Escápula          
        
        Manos

        Piernas
          Fémur
          Fémur
          Tibia
          Tibia          
          Fíbula
          Fíbula        
          
        Pies

        HUESOS QUE SE CARGAN AUTOMÁTICAMENTE
      
        */ 
      }      
    }
  });

  Dinosaurio.associate = function(models) {
    models.Dinosaurio.belongsTo(models.SubClase);
    models.Dinosaurio.hasMany(models.Hueso);
  };
  return Dinosaurio;
};