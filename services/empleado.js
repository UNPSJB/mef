const models = require('../models')
let empleado = models.Empleado;
let persona = models.Persona;
let pedido = models.Pedido;
let personaService = require('./persona');


module.exports = {
    getEmpleados(){//{ tags }//aca se pide datos a la BD        //Cambia ya que no existe rol solo empleado
        return empleado.findAll( {include:[persona]} );
    }, //@TODO mostrar dino sin editar o algo
    getEmpleado( id ){
        return empleado.findByPk(id, {include:[persona]});
    },
    asignarAPedido(pedidoId,empleadoId){
        
        return pedido.findByPk(pedidoId)
        .then((pedidoNuevo)=>{
            return empleado.findByPk(empleadoId)
            .then((empleado)=>{
                return empleado.getPedidos()
                .then((pedidosTrabajando)=>{
                    pedidosTrabajando.push(pedidoNuevo)
                    return empleado.setPedidos(pedidosTrabajando);
                })
            })
        });
    },
    createEmpleado(PersonaId){
        return empleado.create({PersonaId}) 
    },
    getPedidosTrabajando(empleadoID){
        return empleado.getPedidos();
    },
   updateEmpleado(empleadoReq){ //@TODO mostrar dino sin editar o algo
        return empleado.upsert(empleadoReq)
    },
    deleteEmpleado(id){
        return empleado.findByPk(id)
            .then( (empleadoEncontrado) => {
                empleadoEncontrado.destroy(empleadoEncontrado);
            })
    }
};
