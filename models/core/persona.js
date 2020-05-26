'use strict';
module.exports = (sequelize,DataTypes) =>{
    const Persona = sequelize.define('Persona', {
        identificacion: {               //##-********-## o ********
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'La identificacion ya está en uso.'
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
    }, {
        paranoid:true
    })

    Persona.associate = function(models){
        models.Cliente.belongsTo(models.Persona);
        models.Persona.hasMany(models.Cliente);
        models.Empleado.belongsTo(models.Persona);
        models.Persona.hasMany(models.Empleado);
        models.Persona.hasOne(models.User);
        models.User.belongsTo(models.Persona);
        models.Guia.belongsTo(models.Persona);
        models.Persona.hasMany(models.Guia);
        models.Visita.belongsTo(models.Cliente)
        models.Guia.hasMany(models.Visita)
        models.Visita.belongsTo(models.Guia)
        models.Visita.belongsTo(models.Exhibicion)
    };
    return Persona;
};


    