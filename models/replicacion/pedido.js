'use strict'
const Sequelize = require('sequelize');
const Detalle = require('./detalle');
const Persona = require('../core/persona');
const Cancelado = require('../estado/cancelado');
const Confirmado = require('../estado/confirmado');
const Demorado = require('../estado/demorado');
const Entregado = require('../estado/entregado');
const Fabricando = require('../estado/fabricando');
const Facturado = require('../estado/facturado');
const Finalizado = require('../estado/finalizado');
const Pagado = require('../estado/pago');
const Presupuestado = require('../estado/presupuestado');

module.exports = (sequelize,
     DataTypes) => {
    class Pedido extends Sequelize.Model {
        static solicitar(dino, huesos) {
            return Pedido.create().then(p => {
                return Confirmado.create({PedidoId: p.id}).then(()=>p);/// arreglar
            })
        }
        static presupuestar() {
            // solicitar y presupuestar son estaticos porque son los puntos de entrada
            return Pedido.create().then(p =>{
                return Presupuestado.create({PedidoId : p.id}).then(()=>p) //devuelve el pedido
            })
        }
        confirmar(...args){
            return this.estadoInstance.confirmar(this, ...args);
            // confirmar (this, ..args) cambiar de estado a facturado
        }
        hacer(func, ...args) {
            let estado = this.estadoInstance;
            if (func in estado) {
                estado[func](this, ...args);
            }
        }
        
        get estados() {
            return Promise.all([
                this.getCancelados(),
                this.getConfirmados(),
                this.getDemorados(),
                this.getEntregados(),
                this.getFabricandos(),
                this.getFacturados(),
                this.getFinalizados(),
                this.getPresupuestados(), 
            ]).then(estados => {
                return estados.filter(e => e != null).sort((e1,e2) => e1.fecha - e2.fecha);
            });
        }
        //
        // get estadosTodos
        // get estadosUltimo
        get estado() {
            return this.estados.then(estados => estados.pop(0));
        }
    }
    //@TODO agregar metodos que faltan

    Pedido.init({
        autorizacion : {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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

    Pedido.hasMany(Detalle(sequelize, DataTypes));
    Pedido.hasOne(Cancelado(sequelize,DataTypes));
    Pedido.hasOne(Confirmado(sequelize,DataTypes));
    Pedido.hasOne(Demorado(sequelize,DataTypes));
    Pedido.hasOne(Entregado(sequelize,DataTypes));
    Pedido.hasOne(Fabricando(sequelize,DataTypes));
    Pedido.hasOne(Facturado(sequelize,DataTypes));
    Pedido.hasOne(Finalizado(sequelize,DataTypes));
    Pedido.hasOne(Pagado(sequelize,DataTypes));
    Pedido.hasOne(Presupuestado(sequelize, DataTypes));
    
    Pedido.belongsTo(Persona(sequelize, DataTypes));
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