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
                const res = await estado[func](this,args);//this es el pedido, args es el formulario [si lo hay] de el req.body
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
                return estados.filter(e => !!e ).sort((e1,e2) => {
                    return new Date(e2.createdAt) - new Date(e1.createdAt)
                });
            });
        }
        // get estadosUltimo
        get estado() {
            return this.estados.then(estados => {
                return estados.pop(0)
            });
        }
    }
    //@TODO agregar metodos que faltan

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
    }, {sequelize});
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