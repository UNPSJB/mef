const models = require('../models')
let persona = models.Persona;


module.exports = {
    getPersonas(){//{ tags }//aca se pide datos a la BD        //Cambia ya que no existe rol solo cliente
        return persona.findAll();
    },
    getPersona( id ){
        return persona.findByPk(id);
    },
   createPersona(identificacion, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono){
        return persona.create({
            identificacion,
            nombre,
            apellido, 
            direccion, 
            localidad, 
            email, 
            fecha_nacimiento, 
            telefono 
        }).catch((err)=>{
            console.log(err + "AAAAAAAAAAAAAAAAAAAAAAAA");
        });
    },
    updatePersona(personaReq){
        return persona.upsert(personaReq)
                .catch(()=>{
                    console.log("male sal cliente insert");
                });
    },
    deletePersona(id){
        return persona.findByPk(id)
            .then( (personaEncontrado) => {
                personaEncontrado.destroy(personaEncontrado);
            })
            .catch((err) => {
                console.log("mal sale otrave "+err);
            });
    }
}