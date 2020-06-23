const models = require('../models')
const { paginateModel } = require('./utils')


module.exports = {
  getAllEmpleados(args) {
    return models.Empleado.findAndCountAll({
      include: [models.Persona],
      where: {
        ...args
      }
    })
  },
  getEmpleados(page = 0, pageSize = 10, args) {//{ tags }//aca se pide datos a la BD        //Cambia ya que no existe rol solo empleado
    return models.Empleado.findAndCountAll({
      include: [models.Persona],
      where: {
        ...args
      },
      ...paginateModel({ page, pageSize }),
      order: [
        ['updatedAt','DESC']
      ]
    })
  }, //@TODO mostrar dino sin editar o algo
  getEmpleado(id) {
    return models.Empleado.findByPk(id, { include: [models.Persona] })
  },
  asignarAPedido(pedidoId, empleadoId) {
    return models.Pedido.findByPk(pedidoId)
      .then((pedidoNuevo) => {
        return models.Empleado.findByPk(empleadoId)
          .then((empleado) => {
            return models.Empleado.getPedidos()
              .then((pedidosTrabajando) => {
                pedidosTrabajando.push(pedidoNuevo)
                return models.Empleado.setPedidos(pedidosTrabajando)
              })
          })
      })
  },
  createEmpleado(PersonaId) {
    return models.Empleado.create({ PersonaId })
  },
  getPedidosTrabajando(empleadoID) {
    return models.Empleado.getPedidos()
  },
  updateEmpleado(empleadoReq) { //@TODO mostrar dino sin editar o algo
    return models.Empleado.upsert(empleadoReq)
  },
  deleteEmpleado(id) {
    return models.Empleado.findByPk(id)
      .then((empleadoEncontrado) => {
        empleadoEncontrado.destroy(empleadoEncontrado)
      })
  }
}
