const models = require("../models");
let personaService = require("./persona");

const paginate = ({ page, pageSize }) => {
  const offset = page * pageSize;
  const limit = pageSize;

  return {
    offset,
    limit,
  };
};

module.exports = {
  getGuias(page = 1, pageSize = 10) {
    //{ tags }//aca se pide datos a la BD
    return models.Guia.findAll({ 
      include: [{
        model:models.Persona,
      }, {
        model:models.Idioma
      }],
      ...paginate({page, pageSize})
    })
  },
  getGuia(id) {
    return models.Guia.findByPk(id, { include: [models.Persona] });
  },
  // CREATE para Existentes
  createGuia(dias_trabaja, fecha_alta, horario_trabaja, idiomas, PersonaId) {
    var idiomas = [...idiomas];
    return models.Guia.create({
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
  getIdiomas(args) {
    return models.Idioma.findAll({
      where: {
        ...args
      }
    });
  },
  updateGuia(guiaReq) {
    return models.Guia.upsert(guiaReq);
  },

  deleteGuia(id) {
    return models.Guia.findByPk(id).then(guiaEncontrado => {
      guiaEncontrado.destroy(guiaEncontrado);
    });
  }
};
