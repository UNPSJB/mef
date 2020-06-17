'use strict'
module.exports = (sequelize, DataTypes) => {
  const Fosil = sequelize.define('Fosil', {
    numero_coleccion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    peso: DataTypes.FLOAT,
    disponible: DataTypes.BOOLEAN,
    fecha_encontrado: DataTypes.DATEONLY,
    observacion: DataTypes.STRING,
    huesos: {
      type: DataTypes.ENUM,
      values: ['Cráneo', 'Torax','Vertebral', 'Pelvis','Brazo','Manos','Piernas','Pies']
    },
    DinosaurioId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Dinosaurios', //nombre en la tabla Pg
        key: 'id' // id de la tabla PgSubClases
      }
    }
  },{
    paranoid:true
  });
  return Fosil;
};
