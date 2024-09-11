'use strict';
const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Empleado extends Sequelize.Model {
    asignarAPedido(pedidoId, empleadoId) {
      return sequelize.models.Pedido.findByPk(pedidoId).then(pedidoNuevo => {
        return sequelize.models.Empleado.findByPk(empleadoId).then(
          empleado => {
            return empleado.getPedidos().then(pedidosTrabajando => {
              pedidosTrabajando.push(pedidoNuevo);
              return empleado.setPedidos(pedidosTrabajando);
            });
          }
        );
      });
    }
  }
  Empleado.init({
    PersonaId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Personas',
        key: 'id',
      },
      unique: {
        args: true,
        msg: "Ya existía un empleado cargado con ese Documento."
      },
      allowNull: {
        args: false,
        msg: 'El Empleado debe estar asociado a una Persona.'
      }
    }
  }, {
    paranoid: true
  });

  return Empleado;
};