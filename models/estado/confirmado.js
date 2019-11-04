'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
    class Confirmado extends Sequelize.Model{
        fabricar(pedido,PedidoId){
        }
    }
    
    Confirmado.init({
        fecha:DataTypes.DATE,
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

// 
//
//