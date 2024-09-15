'use strict';

module.exports = (sequelize, DataTypes) => {
  const Dinosaurio = sequelize.define(
    'Dinosaurio',
    {
      nombre: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: 'El nombre de Dinosaurio ya esta en uso',
        },
        validate: {
          len: {
            args: [1, 30],
            msg: 'El nombre del Dinosaurio tiene un maximo de 30 caracteres',
          },
        },
        allowNull: {
          args: false,
          msg: 'El Dinosaurio debe tener nombre.',
        },
      },
      alimentacion: {
        type: DataTypes.ENUM,
        values: ['Herbivoro', 'Carnivoro', 'Omnivoro'],
        allowNull: {
          args: false,
          msg: 'El Dinosaurio debe tener tipo de alimentacion.',
        },
      },
      periodo: {
        type: DataTypes.ENUM,
        values: ['Cretacico', 'Jurasico', 'Triasico'],
        allowNull: {
          args: false,
          msg: 'El Dinosaurio debe tener un periodo de existencia.',
        },
      },
      descubrimiento: {
        type: DataTypes.DATEONLY,
        allowNull: {
          args: false,
          msg: 'El Dinosaurio debe tener una fecha de descubrimiento.',
        },
      },
      SubClaseId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'SubClases', //nombre en la tabla
          key: 'id', // id de la tabla SubClases
        },
        allowNull: {
          args: false,
          msg: 'El Dinosaurio debe pertenecer a una subclase.',
        },
      },
    },
    {
      paranoid: true,
      indexes: [
        {
          fields: ['id'],
        },
      ],
    }
  );

  Dinosaurio.associate = function (models) {
    models.Fosil.belongsTo(models.Dinosaurio);
    models.Dinosaurio.hasMany(models.Hueso);
    models.Hueso.belongsTo(models.Dinosaurio);
    models.Dinosaurio.hasMany(models.Fosil);
    models.Dinosaurio.hasMany(models.Replica);
    models.Replica.belongsTo(models.Dinosaurio);
  };
  return Dinosaurio;
};
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
