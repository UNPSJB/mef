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
            })
        }
        finalizar(pedido,args){
            const PedidoId = pedido.id;
            const fechaInicio = pedido.createdAt;
            const fecha_fin = args.fecha_fin;
            const tipoPedido = pedido.tipo;
            
            return sequelize.models.Finalizado.create({
                PedidoId
            }).then(async ()=>{
                
                if(tipoPedido == 'Interno'){
                    const detalles = await pedido.getDetalles([sequelize.models.Hueso]);
                    const hueso = await sequelize.models.Hueso.findByPk(detalles[0].HuesoId);
                    console.log(hueso);
                    const DinosaurioId = hueso.DinosaurioId;
                    detalles.forEach(item=>{
                        sequelize.models.Replica.create({
                        disponible:true,
                        PedidoId,
                        DinosaurioId,
                        HuesoId:item.HuesoId,
                        fecha_inicio: fechaInicio,
                        fecha_fin
                        })
                    })
                }
                else{
                    const detalles = await pedido.getDetalles([sequelize.models.Hueso]);
                    const hueso = await sequelize.models.Hueso.findByPk(detalles[0].HuesoId);
                    console.log(hueso);
                    const DinosaurioId = hueso.DinosaurioId;  
                    detalles.forEach(item=>{
                        sequelize.models.Replica.create({
                        disponible:false,
                        PedidoId,
                        HuesoId:item.HuesoId,
                        DinosaurioId,
                        fecha_inicio: fechaInicio,
                        fecha_fin,
                        fecha_baja: fechaFin
                        })
                    })
                } 
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