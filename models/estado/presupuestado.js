'use strict'
// ALEX ESTUVO ACA, Y LAUTARO TAMBIEN

const Sequelize = require('sequelize');
const Pedido = require('../replicacion/Pedido');
const Facturado = require('./facturado');
const models = require('../index');
const replicaService = require('../../services/replicas')

module.exports = (sequelize, DataTypes) =>{
   class Presupuestado extends Sequelize.Model{
        cancelar(pedido, args){
            sequelize.models.Cancelado.create({
                fecha: new Date(),
                PedidoId:pedido.id
            }).then(cancelado=>{
                pedido.estadoInstance = 'Cancelado';
                console.log(pedido);
                replicaService.updatePedido(pedido);
                
            })
            .catch(e=>console.log('cancelar pedido fallo :',e))
        }
        facturar(){
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
