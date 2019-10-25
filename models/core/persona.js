'use strict';
module.exports = (sequelize, DataTypes) =>{
    const Persona = sequelize.define('Persona', {
        identificacion: DataTypes.INTEGER, //##-********-## o ********
        activo: DataTypes.BOOLEAN,
        nombre:DataTypes.STRING, //solo alfabetico
        apellido:DataTypes.STRING,//solo alfabetico
        direccion:DataTypes.STRING,
        localidad:DataTypes.STRING,
        email:DataTypes.STRING,
        fecha_nacimiento: DataTypes.DATEONLY,
        telefono: DataTypes.STRING
    })
    Persona.associate = function(models) {
        models.Persona.hasMany(models.Rol);
    };
    return Persona;
};
//
//agregarRol(Rol)