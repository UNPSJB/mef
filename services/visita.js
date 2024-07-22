const models = require('../models');
const { paginateModel } = require('./utils');

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
  createVisita(ExhibicionId, ClienteId, GuiumId, cantidadDePersonas, fechaVisita, horario, precio) {
    return models.Visita.create({
      ExhibicionId,
      ClienteId,
      GuiumId,
      cantidadDePersonas,
      fechaVisita,
      horario,
      precio,
      cancelada: false,
    });
  },
  updateVisita(
    id,
    ExhibicionId,
    ClienteId,
    GuiumId,
    cantidadDePersonas,
    fechaVisita,
    horario,
    precio,
    cancelada = false
  ) {
    return models.Visita.findByPk(id).then(visit => {
      return visit.update({
        ExhibicionId,
        ClienteId,
        GuiumId,
        cantidadDePersonas,
        fechaVisita,
        horario,
        precio,
        cancelada,
      });
    });
  },
  deleteVisita(id) {
    return models.Visita.findByPk(id).then(visita => {
      visita.destroy();
    });
  },
};
