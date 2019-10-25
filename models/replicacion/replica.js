'use strict'
// ALEX ESTUVO ACA, Y LAUTARO TAMBIEN
module.exports = (sequelize, DataTypes) =>{
    const Replica = sequelize.define('Replica', {
        codigo: DataTypes.STRING,
        fecha_inicio: DataTypes.DATEONLY,
        fecha_fin: DataTypes.DATEONLY,
        fecha_baja:DataTypes.DATEONLY,
        obs: DataTypes.STRING,
        
    });
    Replica.associate = function (models){
        models.Replica.belongsTo(models.Pedido);
        models.Replica.belongsTo(models.Hueso);
        // models.Replica.belongsTo(models.Exhibicion);
    }
    return Replica;
}

//
//