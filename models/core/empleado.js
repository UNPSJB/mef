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
        descripcion: {
            type: DataTypes.STRING,
            defaultValue: "Empleado"
        },  //Variable que proviene de la clase rol

        fecha_fin: DataTypes.DATEONLY,
        PersonaId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Personas',
                key: 'id',
            }
        }
    }, {sequelize});
    return Empleado;
}