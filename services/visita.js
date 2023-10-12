const models = require('../models');
const { paginateModel } = require('./utils')

module.exports = {
  getAllVisitas(args,opts={}){
    return models.Visita.findAll({
      where: {
        ...args
      },
      include: [{ model: models.Cliente, include: models.Persona }, { model: models.Guia, include: models.Persona }, { model: models.Exhibicion }],
      ...opts
    });
  },
  countVisitas() {
    return models.Visita.count()
  },
  getVisitas(page = 0, pageSize = 10, args) {
    return models.Visita.findAndCountAll({
      where: {
        ...args
      },
      include: [{ model: models.Cliente, include: models.Persona }, { model: models.Guia, include: models.Persona }, { model: models.Exhibicion }],
      ...paginateModel({page, pageSize})
    });
  },
  getVisita(id, opts={}) {
    return models.Visita.findOne({
      where: {
        id
      },
      ...opts,
      include: [{ model: models.Cliente, include: models.Persona }, { model: models.Guia, include: models.Persona }, { model: models.Exhibicion }]
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
      cancelada: false
    })
  },
  updateVisita(id, ExhibicionId, ClienteId, GuiumId, cantidadDePersonas, fechaVisita, horario, precio, cancelada = false) {
    return models.Visita.findByPk(id)
      .then(visit => {
        return visit.update({
          ExhibicionId,
          ClienteId,
          GuiumId,
          cantidadDePersonas,
          fechaVisita,
          horario,
          precio,
          cancelada
        })
      });
  },
  deleteVisita(id) {
    return models.Visita.findByPk(id)
      .then((visita) => {
        visita.destroy();
      })

  }
}