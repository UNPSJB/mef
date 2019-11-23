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
            const PedidoId = pedido.id;
            const fechaInicio = pedido.createdAt;
            const fechaFin = args.fechafin;
            const tipoPedido = pedido.tipo;
            return sequelize.models.Finalizado.create({
                PedidoId
            }).then(async ()=>{
                
                if(tipoPedido == 'Interno'){
                    const detalles = await pedido.getDetalles([sequelize.models.Hueso]);
                    detalles.forEach(item=>{
                        sequelize.models.Replica.create({
                        PedidoId,
                        HuesoId:item.HuesoId,
                        fecha_inicio: fechaInicio,
                        fecha_fin: fechaFin
                        })
                    })
                }
                else{
                    const detalles = await pedido.getDetalles([sequelize.models.Hueso]);
                    detalles.forEach(item=>{
                        sequelize.models.Replica.create({
                        PedidoId,
                        HuesoId:item.HuesoId,
                        fecha_inicio: fechaInicio,
                        fecha_fin: fechaFin,
                        fecha_baja: fechaFin
                        })
                    })
                } 
                
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