'use strict'
module.exports = (sequelize, DataTypes) => {
  const Fosil = sequelize.define('Fosil', {
    numero_coleccion: {
      type: DataTypes.STRING,
      allowNull: {
        args:false,
        msg:'El Fósil debe tener un número de colección.'
      },
      validate: {
        len: {
          args: [1,30],
          msg:'El número Fósil tiene un maximo de 30 caracteres.'
        }
      }
    },
    peso: {
      type:DataTypes.FLOAT,
      allowNull: {
        args:false,
        msg:'El Fósil debe tener un peso.'
      },
      validate: {
        max: {
          args:2000,
          msg:'El peso máximo del Fósil es 2000 kg.'
        },
        min: {
          args:0,
          msg:'El Peso mínimo del Fósil es 0 kg.'
        }
      }
    },
    disponible: {
      type:DataTypes.BOOLEAN,
      allowNull: {
        args:false,
        msg:'El Fósil debe tener si esta disponible para exhibición.'
      }      
    },
    fecha_encontrado: {
      type: DataTypes.DATEONLY,
      allowNull: {
        args:false,
        msg:'El Fósil debe tener la fecha en que fue encontrado.'
      }
    },
    observacion: {
      type: DataTypes.STRING,
      allowNull:true,
      validate: {
        len: {
          args: [0,140],
          msg:'La observación del Fósil tiene un maximo de 140 caracteres.'
        }
      }
    },
    huesos: {
      type: DataTypes.ENUM,
      values: ['Cráneo', 'Torax','Vertebral', 'Pelvis','Brazo','Manos','Piernas','Pies'],
      allowNull: {
        args:false,
        msg:'El Fósil debe tener el hueso de referencia.'
      }
    },
    DinosaurioId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Dinosaurios', 
        key: 'id'
      },
      allowNull: {
        args:false,
        msg:'El Fósil debe tener el dinosaurio de referencia.'
      }
    }
  },{
    paranoid:true
  });
  return Fosil;
};
