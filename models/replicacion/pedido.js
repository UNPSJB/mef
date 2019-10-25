'use strict'

module.exports = (sequelize, DataTypes) =>{
    const Pedido = sequelize.define('Pedido', {
        autorizacion : DataTypes.BOOLEAN,
        motivo : DataTypes.STRING,
        tipo: {
            type: DataTypes.ENUM,
            values : ['Interno','Externo']
        }
    },{
        hooks:{
            afterValidate: (replica)=>{
                if(replica.tipo == 'Interno'){
                    // estado inicial interno = 'confirmado'

                }
                if(replica.tipo == 'Externo'){
                    // estado inicial externo = 'presupuestado'

                }
            }
        }
    });
    Pedido.associate = function (models){
        // ALEX ESTUVO ACA
        // models.Pedido.hasMany(models.Replica);
        // models.Pedido.hasMany(models.Detalle);
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
//



