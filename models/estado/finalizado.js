'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
    class Finalizado extends Sequelize.Model{
        entregar(pedido,args){
            const {fecha_envio, fecha_entrega} = args;
            if(pedido.tipo === 'Externo'){
                return sequelize.models.Entregado.create({
                    fecha_envio,
                    fecha_entrega,
                    PedidoId:pedido.id
                })
            }else{
                return new Error("No se puede realizar esa accion, el pedido es interno")
            }
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
