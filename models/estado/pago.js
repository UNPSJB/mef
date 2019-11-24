'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
    class Pago extends Sequelize.Model{

    }
    Pago.init({
        tipo : {
            type:DataTypes.ENUM,
            values: ['Efectivo', 'Cheque']
        },
        monto : DataTypes.FLOAT,
        fecha:{
            type: DataTypes.DATE,
            defaultValue: new Date(),
            allowNull:false
        }
    }, {sequelize});
    Pago.associate = function (models){
        models.Pago.belongsTo(models.Pedido);
    }
    return Pago;
}