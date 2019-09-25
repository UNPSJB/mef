'use strict';
module.exports = (sequelize, DataTypes) =>{
    const User = sequelize.define('User',{
        email:DataTypes.STRING,
        password: DataTypes.STRING
    })
    User.associate = function(models){
        models.User.belongsTo(models.Persona);
        models.User.belongsToMany(models.Rol, {
            through:'user_rol'
        });
    };
    return User;
};