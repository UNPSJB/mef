// Persona (#54 )
// Fecha de alta
// Días en que trabaja
// Horario de trabajo
// Idiomas [1..n]

"use strict";
module.exports = (sequelize, DataTypes) => {
  const Guia = sequelize.define("Guia", {
    dias_trabaja: {
      type: DataTypes.ENUM,
      values: ["Normal", "Franquero"],
      defaultValue: "Normal"
    },
    fecha_alta: {
      type: DataTypes.DATEONLY
    },
    horario_trabaja: {
        type: DataTypes.ENUM,
        values: ["Diurno", "Nocturno"],
        defaultValue: "Diurno"
    },
    PersonaId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Personas",
        key: "id"
      },
      unique: {
        args: true,
        msg: "Ya existe un Guia con ese Documento"
      }
    }
  });
  return Guia;
};

// Un GUIA puede estar en muchas VISITAS GUIADAS
// y muchas VISITAS GUIADAS tiene muchos GUIAS
