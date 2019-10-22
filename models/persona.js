'use strict';
module.exports = (sequelize,DataTypes) =>{
    const Persona = sequelize.define('Persona', {
        identificacion: {               //##-********-## o ********
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'bale berga la vida'
            }
        },
        activo: DataTypes.BOOLEAN,
        nombre:DataTypes.STRING, //solo alfabetico
        apellido:DataTypes.STRING,//solo alfabetico
        direccion:DataTypes.STRING,
        localidad:DataTypes.STRING,
        email:DataTypes.STRING,
        fecha_nacimiento: DataTypes.DATEONLY,
        telefono: DataTypes.STRING
    })
    return Persona;
};


    