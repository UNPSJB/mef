'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
    class Facturado extends Sequelize.Model{
        confirmar(pedido,args){
            return sequelize.models.Confirmado.create({
                PedidoId: pedido.id
            }).then( ()=>{
                return pedido.update({
                    estadoInstance:'Confirmado',
                    autorizacion:true
                })
            })
        }
    };
    Facturado.init({
        descripcion:{
            type:DataTypes.STRING,
            defaultValue:'Facturado'
        },
    },{sequelize});
    Facturado.associate = function(models){
        Facturado.belongsTo(models.Pedido);
    }
    // Facturado.belongsTo(Presupuestado(sequelize,DataTypes));
    
    // Facturado.hasOne(Pago(sequelize, DataTypes));
    return Facturado;
}