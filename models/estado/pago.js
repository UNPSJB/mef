'use strict'
// ALEX ESTUVO ACA, Y LAUTARO TAMBIEN
module.exports = (sequelize, DataTypes) =>{
    const Pago = sequelize.define('Pago', {
        tipo : {
            type:DataTypes.ENUM,
            values: ['Efectivo', 'Cheque']
        },
        monto : DataTypes.FLOAT,
    });
    Pago.associate = function (models){
        models.Pago.belongsTo(models.Facturado);
    }
    return Pago;
}