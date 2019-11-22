'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
    class Fabricando extends Sequelize.Model{
        fabricar(){
            console.log('No se puede realizar la accion');
        }
        finalizar(pedido,args){
            /**
             * @TODO agregar Replicas creadas del detalle de las replicas
             */
            const PedidoId = pedido.id;
            return sequelize.models.Finalizado.create({
                PedidoId
            }).then(async ()=>{
                const tipoPedido = pedido.tipo;
                console.log(tipoPedido);

                if(tipoPedido == 'Interno')
                    console.log('INTERNO');
                else
                    console.log('EXTERNO');

                if(tipoPedido == 'Interno'){
                    const detalles = await pedido.getDetalles([sequelize.models.Hueso]);
                    detalles.forEach(item=>{
                        console.log('item:::::::',item);
                        sequelize.models.Replica.create({
                        PedidoId,
                        HuesoId:item.HuesoId
                        })
                    })
                }
                else
                    console.log('EXTERNO');
                
                return pedido.update({
                    estadoInstance:'Finalizado'
                })
            })
        }
    }
    Fabricando.init({
        descripcion : {
            type:DataTypes.STRING,
            defaultValue:'Fabricando'
        },
        cantidad_empleados : DataTypes.INTEGER,
        inicio_estimada: DataTypes.DATEONLY,
        fin_estimada: DataTypes.DATEONLY,
        PedidoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Pedidos',
                key:'id'
            }
        }

    },{sequelize});
    Fabricando.associate = function (models){
        models.Fabricando.belongsTo(models.Pedido);
    }
    return Fabricando;
}