'use strict';
module.exports = (sequelize, DataTypes) => {
  const IdiomaGuia = sequelize.define('IdiomaGuia', {}, {});

  const Guia = sequelize.define('Guia', {
    dias_trabaja: {
      type: DataTypes.ENUM,
      values: ['Normal', 'Franquero'],
      allowNull: {
        args: false,
        msg: 'El guía debe especificar si es normal o franquero.'
      },
      defaultValue: 'Normal'
    },
    horario_trabaja: {
      type: DataTypes.ENUM,
      values: ['Diurno', 'Nocturno'],
      allowNull: {
        args: false,
        msg: 'El guía debe especificar si trabaja en horario diurno o nocturno.'
      },
      defaultValue: 'Diurno'
    },
    PersonaId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Personas',
        key: 'id'
      },
      unique: {
        args: true,
        msg: 'Un Guía con este DNI ya se encontraba registrado.'
      },
      allowNull: {
        args: false,
        msg: 'El guía debe estar asociado a una Persona.'
      }
    }
  }, {
    paranoid: true
  });

  Guia.associate = function (models) {
    models.Idioma.belongsToMany(models.Guia, {
      through: IdiomaGuia
    });
    models.Guia.belongsToMany(models.Idioma, {
      through: IdiomaGuia
    });
  }

  return Guia;
};