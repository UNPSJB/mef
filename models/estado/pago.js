'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
    class Pago extends Sequelize.Model{

    }
    Pago.init({
        fecha:DataTypes.DATE,
        tipo : {
            type:DataTypes.ENUM,
            values: ['Efectivo', 'Cheque']
        },
        monto : DataTypes.FLOAT,
    }, {sequelize});
    Pago.associate = function (models){
        models.Pago.belongsTo(models.Pedido);
    }
    return Pago;
}