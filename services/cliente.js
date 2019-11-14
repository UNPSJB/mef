const models = require('../models')
let cliente = models.Cliente;
let persona = models.Persona;
let personaService = require('./persona');


module.exports = {
    getClientes(){//{ tags }//aca se pide datos a la BD        //Cambia ya que no existe rol solo cliente
        return cliente.findAll({include:[persona]});
    }, 
    getCliente( id ){
        return cliente.findByPk(id, {include:[persona]});
    },
   createClienteExiste(tipo, PersonaId){
        return cliente.create({
            tipo,
            PersonaId
        });
    },
    createCliente(tipo, identificacion ,nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono){
        return personaService.createPersona(identificacion ,nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono)
        .then((persona)=>{
            return cliente.create({
                tipo,
                PersonaId:persona.id
            })
        })
    },
    updateCliente(clienteReq){
        return cliente.upsert(clienteReq)
        .then((cliente)=>{
            console.log(clienteReq);
            console.log(cliente);
        })
                .catch(()=>{
                    console.log("ocurrio un error en el upsert de cliente");
                });
    },
    deleteCliente(id){
        return cliente.findByPk(id)
            .then( (clienteEncontrado) => {
                clienteEncontrado.destroy(clienteEncontrado);
            })
            .catch((err) => {
                console.log("mal sale otrave "+err);
            });
    }
};
