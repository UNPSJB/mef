const models = require("../models");
let guia = models.Guia;
let persona = models.Persona;
// let exhibicion = models.Exhibicion;
let personaService = require("./persona");

module.exports = {
  getGuias() {
    //{ tags }//aca se pide datos a la BD
    return guia.findAll({ include: [persona] });
  },
  getGuia(id) {
    return guia.findByPk(id, { include: [persona] });
  },
  // CREATE para Existentes
  createGuia(dias_trabaja, fecha_alta, horario_trabaja, idiomasId, PersonaId) {
    return guia
      .create({
        dias_trabaja,
        fecha_alta,
        horario_trabaja,
        PersonaId
      })
      .then(guia => {
        idiomasId.array.forEach(IdiomaId => {
          models.IdiomaGuia.create({
            IdiomaId,
            GuiaId: guia.id
          });
        });
      });
  },
  // PUEDE QUE NO VAYA

  //   asignarAExhibicion(exhibicionId, guiaId) {
  //     return exhibicion.findByPk(pedidoId).then(exhibicionNueva => {
  //       return guia.findByPk(guiaId).then(guia => {
  //         return guia.getExhibiciones().then(exhibicioesActivas => {
  //           exhibicioesActivas.push(exhibicionNueva);
  //           return empleado.setExhibiciones(exhibicioesActivas);
  //         });
  //       });
  //     });
  //   },
  //   getExhibicionesActivas(guiaId) {
  //     return guia.getPedidos();
  //   },

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
