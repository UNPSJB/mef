'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
    class Presupuestado extends Sequelize.Model{
        cancelar(pedido, args){
            const PedidoId = pedido.id;
            return sequelize.models.Cancelado.create({
                PedidoId,
                obs:args.observacion,
                fecha:this.fecha_fin_oferta,
                fecha_baja: new Date()
            }).then(()=>{
                return pedido.update({
                    autorizacion:true
                })
            })
        }
        facturar(pedido, args){
            const PedidoId = pedido.id;
            return sequelize.models.Facturado.create({
                PedidoId
            }).then(()=>{
                //actualiza el estado
                return sequelize.models.Pago.create({
                    tipo:args.tipopago,
                    monto: args.presupuesto,
                    moneda: this.moneda
                })
            }).then(() =>{
                return pedido.update({
                    autorizacion:true,
                })  
            }).then(()=>{
                return sequelize.models.Confirmado.create({
                    PedidoId,
                    fecha:new Date()
                })
            })
        }
   }
   Presupuestado.init({
    descripcion: {
        type:DataTypes.STRING,
        defaultValue:'Presupuestado'
    },
    fecha:{
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull:false
    },
    cantidad_huesos: DataTypes.INTEGER,
    monto: DataTypes.FLOAT,
    moneda: {
        type: DataTypes.ENUM,
        values: ['Pesos Argentinos', 'Dolares','Euros'] 
    }, 
    fecha_fin_oferta: DataTypes.DATEONLY,
    PedidoId: {
        type:DataTypes.INTEGER,
        references:{
            model:'Pedidos',
            key:'id'
        }
    }
   }, {
       paranoid:true,
       sequelize
    });
   Presupuestado.associate = function (models){
        Presupuestado.belongsTo(models.Pedido);
   }
   return Presupuestado;
}

// asignarHuesos(colHuesos)
