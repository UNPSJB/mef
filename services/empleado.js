const models = require('../models')
let empleado = models.Empleado;
let persona = models.Persona;
let pedido = models.Pedido;
let empleadoPedido = models.empleadoPedido;
let personaService = require('./persona');


module.exports = {
    getEmpleados(){//{ tags }//aca se pide datos a la BD        //Cambia ya que no existe rol solo empleado
        return empleado.findAll( {include:[persona]} );
    }, //@TODO mostrar dino sin editar o algo
    getEmpleado( id ){
        return empleado.findByPk(id, {include:[persona]});
    },
   createEmpleado(PersonaId){
        return empleado.create({
            tipo,
            PersonaId
        });
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
    getPedidosTrabajando(empleadoID){
        return empleado.getPedidos();
    }
    ,
    createEmpleados(documento, nombre, apellido,  direccion,  localidad, email,  fecha_nacimiento, telefono){
        
        
            
            return personaService.createPersona(documento, nombre, apellido,  direccion,  localidad, email,  fecha_nacimiento, telefono)
            .then((persona)=>{
                return empleado.create({
                    PersonaId:persona.id
                })

            })
        
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
