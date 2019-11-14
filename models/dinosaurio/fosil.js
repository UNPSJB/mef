// Diccionario de datos

// Hueso (#6)
// Numero de Colección
// Peso (KG)
// Disponible [VERDADERO | FALSO]
// Fecha Encontrado[dd/mm/yyyy]
// Observación

"use strict";
module.exports = (sequelize, DataTypes) => {
  const Fosil = sequelize.define("Fosil", {
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
      values: [
        "Craneo",
        "Mandibula",
        "Paladar",
        "Vertebras Cervicales",
        "Costillas Cervicales",
        "Vertebras Dorsales",
        "Costillas Dorsales",
        "Escapula",
        "Humero",
        "Radio",
        "Unla",
        "Manos",
        "Pies",
        "Pelvis",
        "Vertebras Sacras",
        "Vertebras Caudales",
        "Hemales"
      ]
    },
    DinosaurioId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Dinosaurios", //nombre en la tabla Pg
        key: "id" // id de la tabla PgSubClases
      }
    }
  });

  Fosil.associate = function(models) {
    models.Fosil.belongsTo(models.Dinosaurio);
  };
  return Fosil;
};
