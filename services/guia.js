const models = require("../models");
const personaService = require("./persona");
const { paginateModel } = require("./utils");

module.exports = {
  async getAllGuias() {
    const guias = await models.Guia.findAll({
      include: [
        {
          model: models.Persona,
          required: false,
        },
        {
          model: models.Idioma,
          required: false,
        },
      ],
    });
    return guias.map((g) => g.toJSON());
  },
  countGuias() {
    return models.Guia.count();
  },
  getGuias(page = 0, pageSize = 10) {
    //{ tags }//aca se pide datos a la BD
    return models.Guia.findAndCountAll({
      include: [
        {
          model: models.Persona,
          required: false,
        },
        {
          model: models.Idioma,
          required: false,
        },
      ],
      ...paginateModel({ page, pageSize }),
      order: [["updatedAt", "DESC"]],
    });
  },
  getGuia(id, options = {}) {
    return models.Guia.findByPk(id, { include: [models.Persona], ...options });
  },
  // CREATE para Existentes
  async createGuia(dias_trabaja, fecha_alta, horario_trabaja, idiomas, PersonaId) {
    const idiomas = [...idiomas];
    const guia = await models.Guia.create({
      dias_trabaja,
      fecha_alta,
      horario_trabaja,
      PersonaId,
    })
    return guia.setIdiomas(idiomas);
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
      .then((persona) => {
        return this.createGuia(
          dias_trabaja,
          fecha_alta,
          horario_trabaja,
          idiomasId,
          persona.id
        );
      });
  },
  getIdiomas(args, options = {}) {
    return models.Idioma.findAll({
      where: {
        ...args
      }, ...options
    });
  },
  updateGuia(guiaReq) {
    return models.Guia.upsert(guiaReq);
  },

  async deleteGuia(id) {
    const guiaEncontrado = await models.Guia.findByPk(id);
    return guiaEncontrado.destroy(guiaEncontrado);
  },
};
