'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize,DataTypes) => {
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
    Pedido.associate = function(models){
        models.Pedido.hasMany(models.Detalle);
        models.Pedido.hasMany(models.Demorado);
        models.Pedido.hasOne(models.Confirmado);
        models.Pedido.hasOne(models.Entregado);
        models.Pedido.hasOne(models.Cancelado);
        models.Pedido.hasOne(models.Fabricando);
        models.Pedido.hasOne(models.Facturado);
        models.Pedido.hasOne(models.Finalizado);
        models.Pedido.hasOne(models.Pago);
        models.Pedido.hasOne(models.Presupuestado);    
        models.Pedido.belongsTo(models.Persona);
    }
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