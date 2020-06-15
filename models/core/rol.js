'use strict';
module.exports = (sequelize,DataTypes) =>{
    const Rol = sequelize.define('Rol',{
        descripcion: {
            type: DataTypes.STRING,
            allowNull : false,
			unique: true
        },
        fecha_fin: DataTypes.DATEONLY
    },{
        paranoid:true
    });
    return Rol;
};