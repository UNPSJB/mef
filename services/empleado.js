const models = require('../models')
let empleado = models.Empleado;
let persona = models.Persona;
let personaService = require('./persona');


module.exports = {
    getEmpleados(){//{ tags }//aca se pide datos a la BD        //Cambia ya que no existe rol solo empleado
        return empleado.findAll({include:[persona]});
    },
    getEmpleado( id ){
        return empleado.findByPk(id, {include:[persona]});
    },
   createEmpleado(PersonaId){
        return empleado.create({
            tipo,
            PersonaId
        });
    },
    createEmpleado(documento, nombre, apellido,  direccion,  ciudad, email,  fecha_nacimiento, telefono){
                   //createPersona(identificacion, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono){
        personaService.createPersona(documento, nombre, apellido,  direccion,  ciudad, email,  fecha_nacimiento, telefono)
        .then((persona)=>{
            return empleado.create({
                PersonaId:persona.id
            })
        })
    },

   updateEmpleado(empleadoReq){
        return cliete.upsert(empleadoReq)
                .catch(()=>{
                    console.log("male sal empleado insert");
                });
    },
    deleteEmpleado(id){
        return empleado.findByPk(id)
            .then( (empleadoEncontrado) => {
                empleadoEncontrado.destroy(empleadoEncontrado);
            })
            .catch((err) => {
                console.log("mal sale otrave "+err);
            });
    }
};
