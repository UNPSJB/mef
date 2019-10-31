'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
    class Facturado extends Sequelize.Model{
        confirmar(pedido,{
            
        }){

        }
    };
    Facturado.belongsTo(Pedido(sequelize,DataTypes));
    Facturado.belongsTo(Presupuestado(sequelize,DataTypes));
    
    Facturado.hasOne(Pago(sequelize, DataTypes));
    return Facturado;
}