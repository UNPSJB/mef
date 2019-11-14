const models = require('../models')
let empleado = models.Empleado;
let persona = models.Persona;
let personaService = require('./persona');


module.exports = {
    getEmpleados(){//{ tags }//aca se pide datos a la BD        //Cambia ya que no existe rol solo empleado
        return empleado.findAll({include:[persona]});
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
    createEmpleados(documento, nombre, apellido,  direccion,  ciudad, email,  fecha_nacimiento, telefono){
        
        
            
            return personaService.createPersona(documento, nombre, apellido,  direccion,  ciudad, email,  fecha_nacimiento, telefono)
            .then((persona)=>{
                return empleado.create({
                    PersonaId:persona.id
                })

            })
        
    },

   updateEmpleado(empleadoReq){ //@TODO mostrar dino sin editar o algo
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
