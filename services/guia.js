const models = require('../models');
const personaService = require('./persona');
const { paginateModel } = require('./utils');
const { Op, literal } = require('sequelize');
const MIN_CHARS = 1;

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
    return guias.map(g => g.toJSON());
  },
  countGuias() {
    return models.Guia.count();
  },
  getGuias(page = 0, pageSize = 10, args) {
    return models.Guia.findAll({
      where: args, // Aplicamos los filtros que vengan en 'args'
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
      paranoid: false // Incluir elementos eliminados lógicamente
    });
  },

  getGuia(id, options = {}) {
    return models.Guia.findByPk(id, { include: [models.Persona], ...options });
  },
  // CREATE para Existentes
  createGuia(dias_trabaja, fecha_alta, horario_trabaja, idiomas, PersonaId) {
    var idiomas = [...idiomas];
    return models.Guia.create({
      dias_trabaja,
      fecha_alta,
      horario_trabaja,
      PersonaId,
    }).then(guia => {
      guia.setIdiomas(idiomas);
    });
  },

  // CREATE para Nuevos
  async createGuias(
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
      .createPersona(documento, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono)
      .then(persona => {
        return this.createGuia(dias_trabaja, fecha_alta, horario_trabaja, idiomasId, persona.id);
      });
  },
  getIdiomas(args, options = {}) {
    return models.Idioma.findAll({
      where: {
        ...args,
      },
      ...options,
    });
  },
  updateGuia(guiaReq) {
    return models.Guia.upsert(guiaReq);
  },

  deleteGuia(id) {
    return models.Guia.findByPk(id).then(guiaEncontrado => {
      guiaEncontrado.destroy(guiaEncontrado);
    });
  },
  async getGuiasDataTable({ start, length, search, order, columns }) {
    const [orderValue] = order;
    const columnOrder = columns[parseInt(orderValue.column)].data
      .split('.')
      .map(name => `"${name}"`)
      .join('.');

    let querySearch = {};
    let replacements = { limit: length, offset: start };

    // Verificar si el término de búsqueda cumple con el número mínimo de caracteres
    if (search && search.length >= MIN_CHARS) {
      querySearch.searchTerm = `%${search}%`; // Define searchTerm en querySearch
    } else {
      // Si el término de búsqueda no cumple con el número mínimo de caracteres, paginar de 10 en 10
      querySearch = null;
    }

    // Asegúrate de que searchTerm esté definido en replacements si querySearch no es null
    if (querySearch) {
      replacements.searchTerm = querySearch.searchTerm;
    }

    const guias = await models.sequelize.query(
      `SELECT COUNT( "Persona".id) OVER() AS cantidad_guias,"Persona".id,
            "Persona".identificacion,
            "Guia".id as guia_id,
            "Guia".dias_trabaja,
            "Guia".horario_trabaja,
            "Persona".nombre,
            "Persona".apellido,
            CONCAT(SUBSTRING("Persona".direccion FROM POSITION(' ' IN "Persona".direccion) + 1), ' ', SUBSTRING("Persona".direccion FROM 1 FOR POSITION(' ' IN "Persona".direccion) - 1)) AS direccion,
            "Persona".localidad,
            "Persona".email,
            TO_CHAR("Persona".fecha_nacimiento, 'DD/MM/YYYY') AS fecha_nacimiento,
            "Persona".telefono,
            (
                SELECT ARRAY_TO_STRING(
                    ARRAY_AGG(DISTINCT "Idiomas"."nombre"), ','
                ) 
                FROM "IdiomaGuia" AS "GuiaIdioma"
                INNER JOIN "Idiomas" AS "Idiomas" ON "GuiaIdioma"."IdiomaId" = "Idiomas"."id"
                WHERE "GuiaIdioma"."GuiumId" = "Guia"."id"
            ) AS idiomas
        FROM (
            SELECT DISTINCT "Persona"."id",
                "Persona"."identificacion",
                "Persona"."nombre",
                "Persona"."apellido",
                "Persona"."direccion",
                "Persona"."localidad",
                "Persona"."email",
                "Persona"."fecha_nacimiento",
                "Persona"."telefono"
            FROM "Personas" AS "Persona"
            INNER JOIN "Guia" AS "Guia" ON "Persona"."id" = "Guia"."PersonaId"
            ${querySearch
        ? `WHERE "Persona"."id"::text ILIKE :searchTerm
        OR "Persona"."identificacion" ILIKE :searchTerm
        OR "Persona"."nombre" ILIKE :searchTerm
        OR "Persona"."apellido" ILIKE :searchTerm
        OR "Persona"."direccion" ILIKE :searchTerm
        OR "Persona"."localidad" ILIKE :searchTerm
        OR "Persona"."email" ILIKE :searchTerm
        OR "Guia".dias_trabaja::text ILIKE:searchTerm
        OR "Guia".horario_trabaja::text ILIKE:searchTerm
        OR TO_CHAR("Persona"."fecha_nacimiento", 'DD/MM/YYYY') LIKE :searchTerm
        
        OR "Persona"."telefono" ILIKE :searchTerm
        OR EXISTS (
          SELECT 1 FROM "IdiomaGuia" AS "IG"
          JOIN "Idiomas" AS "I" ON "IG"."IdiomaId" = "I"."id"
          WHERE "IG"."GuiumId" = "Guia"."id"
          AND "I"."nombre" ILIKE :searchTerm
          )`
        : ''
      }
            AND "Guia"."id" IS NOT NULL  -- Esta línea asegura que solo se devuelvan las personas que tienen un ID correspondiente en la tabla de guías
            AND "Persona"."deletedAt" IS NULL
            ORDER BY "Persona"."id" ASC
        ) AS "Persona"
        INNER JOIN "Guia" ON "Persona"."id" = "Guia"."PersonaId"
        WHERE "Guia"."deletedAt" IS NULL
        ORDER BY ${columnOrder} ${orderValue.dir}
        LIMIT :limit
        OFFSET :offset
        `,

      {
        replacements,
      }
    );
    return guias;
  },
};
