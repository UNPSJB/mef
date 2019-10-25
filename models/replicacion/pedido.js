'use strict'

module.exports = (sequelize, DataTypes) =>{
    const Pedido = sequelize.define('Pedido', {
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
        estado:{
            type: DataTypes.ENUM,
            values : ['Presupuestado','Facturado','Confirmado','Fabricando','Demorado','Finalizado','Entregado',],
            defaultValue: 'Presupuestado',
            allowNull : false
        },
        PersonaId:{
            type: DataTypes.INTEGER,
            references:{
                model:'Personas',
                key:'id'
            }
        }
    },{
        hooks:{
            afterValidate: (replica)=>{
                if(replica.tipo == 'Interno'){
                    replica.estado = 'Confirmado'
                }
                if(replica.tipo == 'Externo'){
                    replica.estado = 'Presupuestado'
                }
            }
        }
    });
    Pedido.associate = function (models){
        // ALEX ESTUVO ACA
        // models.Pedido.hasMany(models.Replica);
        models.Pedido.hasMany(models.Detalle);
        models.Pedido.belongsTo(models.Persona);
        // models.Pedido.hasMany(models.Estado);
        // models.Pedido.hasMany(models.EmpleadoTaller);
    }
    return Pedido;
}


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



