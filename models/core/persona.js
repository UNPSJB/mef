'use strict';
module.exports = (sequelize, DataTypes) => {
  /**
   * @TODO agregar validaciones de largo
   */
  const Persona = sequelize.define(
    'Persona',
    {
      identificacion: {
        //##-********-## o ********
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'La Persona debe tener identificacion',
        },
        unique: {
          args: true,
          msg: 'La identificacion ya está en uso.',
        },
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'La Persona debe tener nombre.',
        },
      },
      apellido: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'La Persona debe tener apellido.',
        },
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'La Persona debe tener direccion.',
        },
      },
      localidad: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'La Persona debe tener localidad.',
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'La Persona debe tener email.',
        },
      },
      fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: {
          args: false,
          msg: 'La Persona debe tener fecha de nacimiento.',
        },
      },
      telefono: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'La Persona debe tener número de telefono.',
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

  Persona.associate = function (models) {
    models.Cliente.belongsTo(models.Persona);
    models.Persona.hasMany(models.Cliente);
    models.Empleado.belongsTo(models.Persona);
    models.Persona.hasMany(models.Empleado);
    models.Persona.hasOne(models.User);
    models.User.belongsTo(models.Persona);
    models.Guia.belongsTo(models.Persona);
    models.Persona.hasMany(models.Guia);
    models.Visita.belongsTo(models.Cliente);
    models.Guia.hasMany(models.Visita);
    models.Visita.belongsTo(models.Guia);
    models.Visita.belongsTo(models.Exhibicion);
  };
  return Persona;
};
