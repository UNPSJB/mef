const models = require("../models");
const personaService = require("./persona");
const { paginateModel } = require('./utils')

module.exports = {
  getAllClientes(args){
    return models.Cliente.findAll({
      include: [models.Persona],
      where: {
        ...args
      }
    })
  },
  getClientes(page = 0, pageSize = 10, args) {
    //{ tags }//aca se pide datos a la BD        //Cambia ya que no existe rol solo cliente
    return models.Cliente.findAndCountAll({
      include: [models.Persona],raw:true,nest:true,
      where: {
        ...args
      },
      ...paginateModel({ page, pageSize })
    });
  },
  getCliente(id) {
    return models.Cliente.findByPk(id, { include: [models.Persona] });
  },
  createClienteExiste(tipo, PersonaId) {
    return models.Cliente.create({
      tipo,
      PersonaId
    });
  },
  createCliente(
    tipo,
    identificacion,
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
        identificacion,
        nombre,
        apellido,
        direccion,
        localidad,
        email,
        fecha_nacimiento,
        telefono
      )
      .then(persona => {
        return models.Cliente.create({
          tipo,
          PersonaId: persona.id
        });
      });
  },
  updateCliente(clienteReq) {
    return models.Cliente.upsert(clienteReq);
  },
  deleteCliente(id) {
    return models.Cliente.findByPk(id).then(clienteEncontrado => {
      return clienteEncontrado.destroy(clienteEncontrado);
    });
  }
};
