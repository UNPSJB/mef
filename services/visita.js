const models = require('../models');
const { paginateModel } = require('./utils');
const { Op, literal } = require('sequelize');
const MIN_CHARS = 1;
const genericSearch = (search, fields) => {
  return fields.map(field => {
    if (field === 'Guium.Persona.identificacion') {
      return literal(`"Guium->Persona"."identificacion" ILIKE '%${search}%'`);
    } else if (field === 'Cliente.Persona.identificacion') {
      return literal(`"Cliente->Persona"."identificacion" ILIKE '%${search}%'`);
    } else if (field !== 'id') {
      // Calificar la referencia de columna con el nombre de la tabla apropiada
      return literal(`"Visita"."${field}"::text ILIKE '%${search}%'`);
    } else {
      // Calificar la referencia de columna con el nombre de la tabla apropiada
      return literal(`"Visita"."id"::text ILIKE '%${search}%'`);
    }
  });
};
module.exports = {
  getAllVisitas(args, opts = {}) {
    return models.Visita.findAll({
      where: {
        ...args,
      },
      include: [
        { model: models.Cliente, include: models.Persona },
        { model: models.Guia, include: models.Persona },
        { model: models.Exhibicion },
      ],
      ...opts,
    });
  },
  async verificarVisitas(fecha) {
    try {
      // Convertir la fecha al formato ISO (YYYY-MM-DD)
      const fechaISO = new Date(fecha).toISOString().split('T')[0];

      // Consultar todas las visitas no canceladas para la fecha proporcionada
      const visitas = await models.Visita.findAll({
        where: {
          fechaVisita: fechaISO,
          cancelada: false,
        },
      });

      // Horarios disponibles inicialmente de 9 a 18 hs (asumiendo horas completas)
      const horariosDisponibles = [
        '09:00hs',
        '10:00hs',
        '11:00hs',
        '12:00hs',
        '13:00hs',
        '14:00hs',
        '15:00hs',
        '16:00hs',
        '17:00hs',
        '18:00hs',
      ];

      // Extraer los horarios ocupados
      const horariosOcupados = visitas.map(visita => visita.horario);

      // Filtrar los horarios disponibles para excluir los ocupados
      const horariosFinales = horariosDisponibles.filter(horario => !horariosOcupados.includes(horario));

      // Devolver los horarios disponibles
      return horariosFinales;
    } catch (error) {
      console.error('Error al verificar visitas:', error);
      return []; // Devuelve una lista vacía en caso de error
    }
  },

  async getVisitasDataTable({ start, length, search, order, columns }) {
    let querySearch = undefined;
    const [orderValue] = order;
    const columnOrder = columns[parseInt(orderValue.column)].data
      .split('.')
      .map(name => `"${name}"`)
      .join('.');

    if (search && search.length > MIN_CHARS) {
      querySearch = {
        [Op.or]: genericSearch(search, [
          'id',
          'Cliente.Persona.identificacion',
          'Guium.Persona.identificacion',
          'fechaVisita',
        ]),
      };
    }

    // Contar el número de registros filtrados
    const recordsFiltered = await models.Visita.count({
      where: querySearch,
      include: [
        { model: models.Cliente, include: models.Persona },
        { model: models.Guia, include: models.Persona },
        { model: models.Exhibicion },
      ],
    });

    const visitas = await models.Visita.findAll({
      limit: length,
      offset: start,
      where: querySearch,
      order: literal(`${columnOrder} ${orderValue.dir}`),
      include: [
        { model: models.Cliente, include: models.Persona },
        { model: models.Guia, include: models.Persona },
        { model: models.Exhibicion },
      ],
    });

    return { visitas, recordsFiltered };
  },
  countVisitas() {
    return models.Visita.count();
  },
  getVisitas(page = 0, pageSize = 10, args) {
    return models.Visita.findAndCountAll({
      where: {
        ...args,
      },
      include: [
        { model: models.Cliente, include: models.Persona },
        { model: models.Guia, include: models.Persona },
        { model: models.Exhibicion },
      ],
      ...paginateModel({ page, pageSize }),
    });
  },
  getVisita(id, opts = {}) {
    return models.Visita.findOne({
      where: {
        id,
      },
      ...opts,
      include: [
        { model: models.Cliente, include: models.Persona },
        { model: models.Guia, include: models.Persona },
        { model: models.Exhibicion },
      ],
    });
  },
  createVisita(
    ExhibicionId,
    ClienteId,
    GuiumId,
    cantidadDePersonas,
    fechaVisita,
    horario,
    precio,
    estado,
    observacion
  ) {
    return models.Visita.create({
      ExhibicionId,
      ClienteId,
      GuiumId,
      cantidadDePersonas,
      fechaVisita,
      horario,
      precio,
      estado,
      observacion,
      cancelada: false,
    });
  },
  async updateVisita(
    id,
    ExhibicionId,
    ClienteId,
    GuiumId,
    cantidadDePersonas,
    fechaVisita,
    horario,
    precio,
    estado,
    observacion,
    cancelada = false
  ) {
    const visita = await models.Visita.findByPk(id);
    return visita.update({
      ExhibicionId,
      ClienteId,
      GuiumId,
      cantidadDePersonas,
      fechaVisita,
      horario,
      precio,
      estado,
      observacion,
      cancelada,
    });
  },
};
