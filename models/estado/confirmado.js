'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>{

    class Confirmado extends Sequelize.Model{
        
        fabricar(pedido,args){
            const {fechainicio,fechafin,empleado} = args;
            const descripcion = 'Fabricando';
            const inicio_estimada = fechainicio;
            const fin_estimada = fechafin;
            const cantidad_empleados = empleado.length;
            const PedidoId = pedido.id;

            return sequelize.models.Fabricando.create({
                PedidoId,
                descripcion,
                cantidad_empleados,
                inicio_estimada,
                fin_estimada
            })
            .then(()=>{
                empleado.forEach(emp => {
                    return sequelize.models.Empleado.findByPk(emp)
                    .then((empleado)=>{
                        return empleado.asignarAPedido(PedidoId,empleado.id);
                    })
                });

                return pedido.update({estadoInstance:'Fabricando'});
            });
        }
        cancelar(pedido,args){
            const PedidoId = pedido.id;
            return sequelize.models.Cancelado.create({
                PedidoId
            }).then(()=>{
                return pedido.update({
                    estadoInstance:'Cancelado'
                })
            })
        }
    }
    
    Confirmado.init({
        descripcion : {
            type: DataTypes.STRING,
            defaultValue: "Confirmado"
        },
        PedidoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Pedidos',
                key:'id'
            }
        }
    }, {sequelize});
    Confirmado.associate = function (models){
        models.Confirmado.belongsTo(models.Pedido);
    }
    return Confirmado;
}