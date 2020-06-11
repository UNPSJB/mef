const models = require("../models");
let personaService = require("./persona");

module.exports = {
  getClientes(offset = 0, limit = 10) {
    //{ tags }//aca se pide datos a la BD        //Cambia ya que no existe rol solo cliente
    return models.Cliente.findAll({ include: [models.Persona], limit, offset });
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
