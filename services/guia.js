const models = require("../models");
let guia = models.Guia;
let persona = models.Persona;
// let exhibicion = models.Exhibicion;
let personaService = require("./persona");

module.exports = {
  getGuias() {
    //{ tags }//aca se pide datos a la BD
    return guia.findAll({ include: [persona] }).then( guias => {
      return Promise.all(
        guias.map(async guia => {
          var idiomas = await guia.getIdiomas();
          guia.idiomas = idiomas;
          return guia;
        })
      );
    });
  },
  getGuia(id) {
    return guia.findByPk(id, { include: [persona] });
  },
  // CREATE para Existentes
  createGuia(dias_trabaja, fecha_alta, horario_trabaja, idiomas, PersonaId) {
    var idiomas = [...idiomas];
    return guia
      .create({
        dias_trabaja,
        fecha_alta,
        horario_trabaja,
        PersonaId
      })
      .then(guia => {
        guia.setIdiomas(idiomas);
        });
  },

  // CREATE para Nuevos
  createGuias(
    dias_trabaja,
    fecha_alta,
    horario_trabaja,
    idiomasId,
    documento,
    nombre,
    apellido,
    direccion,
    localidad,
    email,
    fecha_nacimiento,
    telefono
  ) {
    return personaService
      .createPersona(
        documento,
        nombre,
        apellido,
        direccion,
        localidad,
        email,
        fecha_nacimiento,
        telefono
      )
      .then(persona => {
        return this.createGuia(
          dias_trabaja,
          fecha_alta,
          horario_trabaja,
          idiomasId,
          persona.id
        );
      });
  },
  getIdiomas() {
    return models.Idioma.findAll();
  }
  ,
  /* 
    guia.Set.Idiomas( array_of_idiomas )
    .then(
      IdiomasGuia.setIdiomas( array_of_idiomas ) 
    )
  */
  updateGuia(guiaReq) {
    return guia.upsert(guiaReq);
  },

  deleteGuia(id) {
    return guia.findByPk(id).then(guiaEncontrado => {
      guiaEncontrado.destroy(guiaEncontrado);
    });
  }
};
