'use strict'
// ALEX ESTUVO ACA, Y LAUTARO TAMBIEN
module.exports = (sequelize, DataTypes) =>{
    const Facturado = sequelize.define('Facturado', {
        PedidoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Pedidos',
                key:'id'
            }
        }
    });
    Facturado.associate = function (models){
        models.Facturado.belongsTo(models.Pedido);
        models.Facturado.belongsTo(models.Presupuestado);
        //hasOne(unPago)
    }
    return Facturado;
}

// 