'use strict';
module.exports = (sequelize,DataTypes) =>{
    const Rol = sequelize.define('Rol',{
        descripcion: DataTypes.STRING,
        fecha_fin: DataTypes.DATEONLY
    });
    Rol.associate = function(models){
        models.Rol.belongsToMany(models.User,{ 
            through: 'user_rol' 
        });
    };
    return Rol;
};