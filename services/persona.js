const models = require('../models');

module.exports = {
    getPersonas(args){//{ tags }//aca se pide datos a la BD        //Cambia ya que no existe rol solo cliente
        return models.Persona.findAll({
            where:{
                ...args
            }
        });
    },
    getPersonaArgs(args){
        return models.Persona.findOne({
            where:{
                ...args
            }
        })
    },
    getPersona( id ){
        return models.Persona.findByPk(id);
    },
   createPersona(identificacion, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono){
        return models.Persona.create({
            identificacion,
            nombre,
            apellido, 
            direccion, 
            localidad, 
            email, 
            fecha_nacimiento, 
            telefono 
        })
    },
    updatePersona(personaReq){
        return models.Persona.upsert(personaReq);
    },
    deletePersona(id){
        return models.Persona.findByPk(id)
            .then( (personaEncontrado) => {
                personaEncontrado.destroy(personaEncontrado);
            })
            
    }
}