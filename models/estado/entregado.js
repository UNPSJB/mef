'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
    class Entregado extends Sequelize.Model{
        
    }
    Entregado.init({
        fecha_envio: DataTypes.DATEONLY,
        fecha_entrega: DataTypes.DATEONLY, //fecha definitiva de creado, la pone el cliente
        PedidoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Pedidos',
                key:'id'
            }
        }
    },{sequelize});
    Entregado.associate = function (models){
        models.Entregado.belongsTo(models.Pedido);
    }
    return Entregado;
}