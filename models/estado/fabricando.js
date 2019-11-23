'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
    class Fabricando extends Sequelize.Model{
        reanudar(){
            console.log('No se puede realizar la accion');
        }
        fabricar(){
            console.log('No se puede realizar la accion');
        }
        demorar(pedido,args){//retraso_estimado
            const PedidoId = pedido.id;
            const { retraso_estimado } = args;
            return sequelize.models.Demorado.create({
                PedidoId,
                retraso_estimado,
                fecha:new Date()
            }).then(()=>{
                return pedido.update({
                    estadoInstance:'Demorado'
                })
            })
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
        fecha:{
            type: DataTypes.DATE,
            defaultValue: new Date(),
            allowNull:false
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