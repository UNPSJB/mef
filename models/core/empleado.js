'use strict';
module.exports = (sequelize, DataTypes) => {
  const Empleado = sequelize.define('Empleado', {
    PersonaId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Personas',
        key: 'id',
      },
      unique: {
        args: true,
        msg: "Ya existía un empleado cargado con ese Documento."
      },
      allowNull: {
        args: false,
        msg: 'El Empleado debe estar asociado a una Persona.'
      }
    }
  }, {
    paranoid: true
  });

  return Empleado;
};