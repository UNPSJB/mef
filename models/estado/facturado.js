'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
    class Facturado extends Sequelize.Model{
        confirmar(pedido){

        }
    };
    Facturado.init({
        descripcion:{
            type:DataTypes.STRING,
            defaultValue:'Facturado'
        },
        fecha:{
            type:DataTypes.DATEONLY
        }
    },{sequelize});
    Facturado.associate = function(models){
        Facturado.belongsTo(models.Pedido);
    }
    // Facturado.belongsTo(Presupuestado(sequelize,DataTypes));
    
    // Facturado.hasOne(Pago(sequelize, DataTypes));
    return Facturado;
}