'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
    class Presupuestado extends Sequelize.Model{
        cancelar(pedido, args){
            sequelize.models.Cancelado.create({
                PedidoId:pedido.id
            }).then(cancelado=>{
                pedido.update({
                    estadoInstance:'Cancelado'
                })                
            })
            .catch(e=>console.log('cancelar pedido fallo :',e))
        }
        facturar(pedido, args){
            sequelize.models.Facturado.create({
                PedidoId:pedido.id
            }).then( ()=>{
                //actualiza el estado
                sequelize.models.Pago.create({
                    tipo:args.tipopago,
                    monto: args.presupuesto
                })
            }).then( () =>{
                sequelize.models.Confirmado.create({
                    PedidoId: pedido.id
                }).then( (confirmado)=>{
                    //confirmado
                    pedido.update({
                        autorizacion:true,
                        estadoInstance: 'Confirmado'
                    })
                })
            })
        }
   }
   Presupuestado.init({
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
