'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
    class Finalizado extends Sequelize.Model{
        entregar(pedido,args){
            return sequelize.models.Entregado.create({
                PedidoId:pedido.id
            }).then(()=>{
                pedido.update({
                    estadoInstance:'Entregado'
                })
            })
        }
    }
    Finalizado.init({
        finalizacion: DataTypes.DATEONLY, //fecha definitiva de creado, la pone el cliente
        PedidoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Pedidos',
                key:'id'
            }
        },
        fecha:{
            type: DataTypes.DATE,
            defaultValue: new Date(),
            allowNull:false
        }
    },{sequelize});
    Finalizado.associate = function (models){
        models.Finalizado.belongsTo(models.Pedido);
    }
    return Finalizado;
}

// crearReplicas(unaColHuesos)
