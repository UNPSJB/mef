'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize,DataTypes) => {
    const Persona = require('../core/persona')(sequelize,DataTypes);
    const Detalle = require('./detalle')(sequelize,DataTypes);
    const Cancelado = require('../estado/cancelado')(sequelize,DataTypes);
    const Confirmado = require('../estado/confirmado')(sequelize,DataTypes);
    const Demorado = require('../estado/demorado')(sequelize,DataTypes);
    const Entregado = require('../estado/entregado')(sequelize,DataTypes);
    const Fabricando = require('../estado/fabricando')(sequelize,DataTypes);
    const Facturado = require('../estado/facturado')(sequelize,DataTypes);
    const Finalizado = require('../estado/finalizado')(sequelize,DataTypes);
    const Pago = require('../estado/pago')(sequelize,DataTypes);
    const Presupuestado = require('../estado/presupuestado')(sequelize,DataTypes);

    class Pedido extends Sequelize.Model {
        async hacer(func, args){
            const estado = await this.estado;
            console.log('estado:',estado.dataValues, 'funcion', func, '@',this.id);
            const res = await estado[func](this,args);//this es el pedido, args es el formulario [si lo hay] de el req.body
            return res;
        }
        get estados() {
            return Promise.all([
                this.getCancelado(),
                this.getConfirmado(),
                this.getDemorados(),
                this.getEntregado(),
                this.getFabricando(),
                this.getFacturado(),
                this.getFinalizado(),
                this.getPresupuestado(), 
            ]).then(estados => {
                return estados.filter(e =>{
                    if(e == []){
                        return false;
                    }
                    if(e == null){
                        return false;
                    }
                    if('createdAt' in e){
                        return e;
                    }else{
                        return false;
                    }
                }).sort((e1,e2) => {
                    return e2.createdAt - e1.createdAt;
                });
            });
        }
        get estado() {
            return this.estados.then(estados => {
                return estados[0]
            });
        }
        crearDetalles(huesos){
            for (let index = 0; index < huesos.length; index++) {                
                Detalle.create({
                PedidoId:this.id,
                cantidad:1,
                HuesoId: huesos[index],
                renglon: index,
                })
            }
        }
    }

    Pedido.init({
        autorizacion : {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull:false,
        },
        estadoInstance: {
            type:DataTypes.STRING,
            allowNull:false,
        },
        motivo : DataTypes.STRING,
        tipo: {
            type: DataTypes.ENUM,
            values : ['Interno','Externo']
        },
        PersonaId:{
            type: DataTypes.INTEGER,
            references:{
                model:'Personas',
                key:'id'
            }
        }
    }, {
        hooks:{
            afterCreate(pedido){
                if(pedido.estadoInstance === 'Presupuestado'){
                    Presupuestado.create({
                        PedidoId:pedido.id,
                        fecha: new Date()
                    })
                }
                if(pedido.estadoInstance === 'Confirmado'){
                    Confirmado.create({
                        PedidoId:pedido.id,
                        fecha : new Date()
                    })
                }
            }
        },        
    sequelize});
    Pedido.hasMany(Detalle);
    Pedido.hasMany(Demorado);
    Pedido.hasOne(Confirmado);
    Pedido.hasOne(Entregado);
    Pedido.hasOne(Cancelado);
    Pedido.hasOne(Fabricando);
    Pedido.hasOne(Facturado);
    Pedido.hasOne(Finalizado);
    Pedido.hasOne(Pago);
    Pedido.hasOne(Presupuestado);    
    Pedido.belongsTo(Persona);

    // return [Pedido, Detalle];
    return Pedido;
}

// getEstadoPedidos()
// asignarEmpleados(colEmpleados)
// asignarDinosaurio(unDino)
// asignarHuesos(colHuesos)  una coleccion de huesos  
// confirmar()
// cancelar()
// fabricar() inicia la fabricacion
// demorar(unMotivo)
// facturar(unPago) ///poneleeeee
// finalizar()  genera una replica
// entregar(unaFechaEnvio,unaFechaEntrega)
// presupuestar(unDineroAprox)