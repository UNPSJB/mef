'use strict'
const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) =>{
    class Demorado extends Sequelize.Model{
        reanudar(pedido,args){
            return pedido.update({
                estadoInstance:'Fabricando'
            }).then(async ()=>{                
                let fabricando = await pedido.getFabricando();
                return fabricando.update({
                    fecha: new Date()
                })
            })
        }

        demorar(pedido,args){
            console.log('No se puede realizar esa accion viejo');
        }
    }
    Demorado.init({
        fecha:{
            type: DataTypes.DATE,
            defaultValue: new Date(),
            allowNull:false
        },
        descripcion : {
            type:DataTypes.STRING,
            defaultValue:'Demorado',
            allowNull:false  
        } ,
        retraso_estimado: DataTypes.STRING, //3 meses, 2 semanas, dos semanas, cinco anos
        PedidoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Pedidos',
                key:'id'
            }
        }
    }, {sequelize});
    return Demorado;
}

