const models = require('../models');
const personaService = require('./persona');
const { paginateModel } = require('./utils');

module.exports = {
  getAllClientes(args, opts = {}) {
    return models.Cliente.findAll({
      include: [models.Persona],
      where: {
        ...args,
      },
      ...opts,
    });
  },
  getClientes(page = 0, pageSize = 10, args) {
    //{ tags }//aca se pide datos a la BD        //Cambia ya que no existe rol solo cliente
    return models.Cliente.findAndCountAll({
      include: [models.Persona],
      where: {
        ...args,
      },
      ...paginateModel({ page, pageSize }),
    });
  },
  getCliente(id, opts = {}) {
    return models.Cliente.findByPk(id, { include: [models.Persona], ...opts });
  },
  createClienteExiste(tipo, PersonaId) {
    return models.Cliente.create({
      tipo,
      PersonaId,
    });
  },
 
  updateCliente(clienteReq) {
    return models.Cliente.upsert(clienteReq);
  },
  async deleteCliente(id) {
    //preguntar a doni si asi eta bien 
    const clienteEncontrado= await models.Cliente.findByPk(id)
    return clienteEncontrado.destroy(clienteEncontrado);
  },
};
