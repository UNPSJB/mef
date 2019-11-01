'use strict'
// ALEX ESTUVO ACA, Y LAUTARO TAMBIEN

const Sequelize = require('sequelize');
const Pedido = require('../replicacion/Pedido');
const Cancelado = require('./cancelado');
const Facturado = require('./facturado');

module.exports = (sequelize, DataTypes) =>{
   class Presupuestado extends Sequelize.Model{
        cancelar(){
            Cancelado.create({
                fecha:new Date(),
                PedidoId:this.PedidoId,
            })
        }
        facturar(){
            Facturado.create({
                fecha:new Date(),
                PedidoId:this.PedidoId
            })
        }
   }
   Presupuestado.init({
    fecha:DataTypes.DATE,
    descripcion: {
        type:DataTypes.STRING,
        defaultValue:'Presupuestado'
    },
    cantidad_huesos: DataTypes.INTEGER,
    monto: DataTypes.FLOAT,
    fecha_fin_oferta: DataTypes.DATEONLY,
    PedidoId: {
        type:DataTypes.INTEGER,
        references:{
            model:'Pedidos',
            key:'id'
        }
    }
   }, {sequelize});
   Presupuestado.associate = function (models){
        Presupuestado.belongsTo(models.Pedido);
   }
   return Presupuestado;
}

// asignarHuesos(colHuesos)
