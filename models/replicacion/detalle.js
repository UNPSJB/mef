'use strict'
// ALEX ESTUVO ACA, Y LAUTARO TAMBIEN
module.exports = (sequelize, DataTypes) =>{
    const Detalle = sequelize.define('Detalle', {
        renglon : DataTypes.STRING,
        cantidad : DataTypes.INTEGER,
        PedidoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Pedidos',
                key:'id'
            }
        },
        HuesoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Huesos',
                key:'id'
            }
        }
    });
    Detalle.associate = function (models){
        models.Detalle.belongsTo(models.Pedido);
        models.Detalle.belongsTo(models.Hueso);
    }
    return Detalle;
}