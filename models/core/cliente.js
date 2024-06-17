'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define('Cliente', {
    tipo: {
      type: DataTypes.ENUM,
      allowNull: {
        args: false,
        msg: 'El Cliente debe tener un tipo.'
      },
      values: ['Particular', 'Institucional']
    },
    PersonaId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Personas',
        key: 'id',
      },
      unique: {
        args: true,
        msg: "Un Cliente con este DNI ya se encontraba registrado."
      },
      allowNull: {
        args: false,
        msg: 'El Cliente debe estar asociado a una Persona.'
      }
    }
  }, {
    paranoid: true
  })
  return Cliente;
}
