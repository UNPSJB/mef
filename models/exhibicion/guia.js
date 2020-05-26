'use strict'
module.exports = (sequelize, DataTypes) => {
  const IdiomaGuia = sequelize.define('IdiomaGuia',{},{ paranoid:true })
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
  },{
    paranoid:true
  });
  Guia.associate = function(models) {
    models.Idioma.belongsToMany(models.Guia, { 
      through:IdiomaGuia 
    });
    models.Guia.belongsToMany(models.Idioma, { 
        through:IdiomaGuia 
    });
  }
  return Guia;
};
// Un GUIA puede estar en muchas VISITAS GUIADAS
// y muchas VISITAS GUIADAS tiene muchos GUIAS
