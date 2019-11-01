'use strict'
// ALEX ESTUVO ACA, Y LAUTARO TAMBIEN
module.exports = (sequelize, DataTypes) =>{
    const Finalizado = sequelize.define('Finalizado', {
        fecha:DataTypes.DATE,
        finalizacion: DataTypes.DATEONLY, //fecha definitiva de creado, la pone el cliente
        PedidoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Pedidos',
                key:'id'
            }
        }
    });
    Finalizado.associate = function (models){
        models.Finalizado.belongsTo(models.Pedido);
    }
    return Finalizado;
}

// crearReplicas(unaColHuesos)
// 
//