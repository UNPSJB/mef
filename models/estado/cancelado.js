'use strict'
// ALEX ESTUVO ACA, Y LAUTARO TAMBIEN
module.exports = (sequelize, DataTypes) =>{
    const Cancelado = sequelize.define('Cancelado', {
        fecha:DataTypes.DATEONLY,
        fecha_baja:DataTypes.DATEONLY,
        obs: DataTypes.STRING,
        
    });
    Cancelado.associate = function (models){
        models.Cancelado.belongsTo(models.Pedido);
        
    }
    return Cancelado;
}