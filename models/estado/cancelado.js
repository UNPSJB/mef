'use strict'
// ALEX ESTUVO ACA, Y LAUTARO TAMBIEN
module.exports = (sequelize, DataTypes) =>{
    const Cancelado = sequelize.define('Cancelado', {
        fecha_baja:DataTypes.DATEONLY,
        obs: DataTypes.STRING,
        
    });
    Cancelado.associate = function (models){
        models.Cancelado.belongsTo(models.Presupuestado);
        
    }
    return Cancelado;
}