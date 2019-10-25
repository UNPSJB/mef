'use strict'
// ALEX ESTUVO ACA, Y LAUTARO TAMBIEN
module.exports = (sequelize, DataTypes) =>{
    const Entregado = sequelize.define('Entregado', {
        fecha_envio: DataTypes.DATEONLY,
        fecha_entrega: DataTypes.DATEONLY, //fecha definitiva de creado, la pone el cliente
        PedidoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Pedidos',
                key:'id'
            }
        }
    });
    Entregado.associate = function (models){
        models.Entregado.belongsTo(models.Pedido);
    }
    return Entregado;
}

// 
// 
//