'use strict';
module.exports = (sequelize, DataTypes) => {
  const Empleado = sequelize.define('Empleado', {
    PersonaId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Personas',
        key: 'id',
      },
      unique: {
        args: true,
        msg: "Ya existe un Empleado con ese Documento."
      },
      allowNull: {
        args: false,
        msg: 'El Empleado debe estar asociado a una Persona.'
      }
    }
  }, {
    paranoid: true
  });

  // Método de instancia para asignar pedidos a empleados
  Empleado.prototype.asignarAPedido = function (pedidoId) {
    return sequelize.models.Pedido.findByPk(pedidoId).then(pedidoNuevo => {
      return this.getPedidos().then(pedidosTrabajando => {
        pedidosTrabajando.push(pedidoNuevo);
        return this.setPedidos(pedidosTrabajando);
      });
    });
  };

  return Empleado;
};