'use strict';
module.exports = (sequelize, DataTypes) =>{
    const Persona = sequelize.define('Persona', {
        activo: DataTypes.BOOLEAN,
        nombre:DataTypes.STRING,
        apellido:DataTypes.STRING,
        direccion:DataTypes.STRING,
        localidad:DataTypes.STRING,
        email:DataTypes.STRING,
        fecha_nacimiento: DataTypes.DATEONLY,
        telefono: DataTypes.STRING
    })
    Persona.associate = function(models) {

    };
    return Persona;
};