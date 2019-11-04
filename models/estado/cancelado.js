'use strict'
// ALEX ESTUVO ACA, Y LAUTARO TAMBIEN
const Sequelize = require('sequelize');
const Pedido = require('../replicacion/pedido');

module.exports = (sequelize, DataTypes) => {
    class Cancelado extends Sequelize.Model{
        reanudar(){

        }
    }
    Cancelado.init({
        fecha:DataTypes.DATE,
        fecha_baja:DataTypes.DATEONLY,
        obs: DataTypes.STRING,
        descripcion : {
            type: DataTypes.STRING,
            defaultValue: "Cancelado"
        },
        PedidoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Pedidos',
                key:'id'
            }
        } 
    },{sequelize});
    Cancelado.associate = function(models){
        Cancelado.belongsTo(models.Pedido);
    }
    return Cancelado;
}