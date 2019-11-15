'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
    class Confirmado extends Sequelize.Model{
        fabricar(pedido,args){
            return sequelize.models.Fabricando.create({
                PedidoId:pedido.id
            }).then( () =>{
                pedido.update({
                    estadoInstance:'Fabricando'
                })           
            })
        }
        cancelar(pedido,args){
            return sequelize.models.Cancelado.create({
                PedidoId:pedido.id
            }).then(()=>{
                pedido.update({
                    estadoInstance:'Cancelado'
                })
            })
        }
    }
    
    Confirmado.init({
        descripcion : {
            type: DataTypes.STRING,
            defaultValue: "Confirmado"
        },
        PedidoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Pedidos',
                key:'id'
            }
        }
    }, {sequelize});
    Confirmado.associate = function (models){
        models.Confirmado.belongsTo(models.Pedido);
    }
    return Confirmado;
}