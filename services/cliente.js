const models = require('../models')
let cliente = models.Cliente;
let persona = models.Persona;
let personaService = require('./persona');


module.exports = {
    getClientes(){
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
        return cliete.upsert(clienteReq)
                .catch(()=>{
                    console.log("male sal cliente insert");
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