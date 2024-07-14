'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const PedidoEmpleado = sequelize.define('PedidoEmpleado', {}, {});

  const Persona = require('../core/persona')(sequelize, DataTypes);
  const Detalle = require('./detalle')(sequelize, DataTypes);
  const Cancelado = require('../estado/cancelado')(sequelize, DataTypes);
  const Confirmado = require('../estado/confirmado')(sequelize, DataTypes);
  const Demorado = require('../estado/demorado')(sequelize, DataTypes);
  const Entregado = require('../estado/entregado')(sequelize, DataTypes);
  const Fabricando = require('../estado/fabricando')(sequelize, DataTypes);
  const Facturado = require('../estado/facturado')(sequelize, DataTypes);
  const Finalizado = require('../estado/finalizado')(sequelize, DataTypes);
  const Pago = require('../estado/pago')(sequelize, DataTypes);
  const Presupuestado = require('../estado/presupuestado')(sequelize, DataTypes);
  const Hueso = require('../dinosaurio/hueso')(sequelize, DataTypes);
  const Dinosaurio = require('../dinosaurio/dinosaurio')(sequelize, DataTypes);

  class Pedido extends Sequelize.Model {
    async cambiarEstado(nuevoEstado, datos) {
      const estado = await this.estadoActual();
      const estadoActualizado = await estado[nuevoEstado](this, datos); //this es el pedido, args es el formulario [si lo hay] de el req.body
      return estadoActualizado;
    }
    get estados() {
      return Promise.all([
        this.getCancelado(),
        this.getConfirmado(),
        this.getDemorados().then(ultimo => {
          return ultimo.pop();
        }),
        this.getEntregado(),
        this.getFabricando(),
        this.getFacturado(),
        this.getFinalizado(),
        this.getPresupuestado(),
      ]).then(estados => {
        return estados
          .filter(e => {
            if (!e) return false;
            if ('createdAt' in e) {
              return e;
            }
            return false;
          })
          .sort((e1, e2) => {
            // ordenamos por fecha de creacion descendente
            // quiere decir que el ultimo estado (el mas nuevo) es el primero
            return new Date(e2.fecha) - new Date(e1.fecha);
          });
      });
    }
    get estado() {
      return this.estados.then(estados => {
        return estados[0];
      });
    }
    async estadoActual() {
      const estados = await this.estados;
      // Aca es 0 porque lo ordenamos por fecha de creacion descendente
      // por lo tanto el primero es el mas nuevo
      return estados[0];
    }
    crearDetalles(huesos) {
      if (Array.isArray(huesos)) {
        for (let index = 0; index < huesos.length; index++) {
          Detalle.create({
            PedidoId: this.id,
            cantidad: 1,
            HuesoId: huesos[index],
            renglon: index,
          });
        }
      } else {
        Detalle.create({
          PedidoId: this.id,
          cantidad: 1,
          HuesoId: huesos,
          renglon: 1,
        });
      }
    }
  }

  Pedido.init(
    {
      autorizacion: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      motivo: DataTypes.STRING,
      tipo: {
        type: DataTypes.ENUM,
        values: ['Interno', 'Externo'],
      },
      PersonaId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Personas',
          key: 'id',
        },
      },
    },
    {
      paranoid: true,
      sequelize,
      hooks: {
        afterCreate(pedido) {
          const PedidoId = pedido.id;
          if (pedido.tipo === 'Externo') {
            Presupuestado.create({
              PedidoId,
            });
          }
          if (pedido.tipo === 'Interno') {
            Confirmado.create({
              PedidoId,
            });
          }
        },
      },
    }
  );
  Pedido.hasMany(Detalle);
  Detalle.belongsTo(Pedido);
  Pedido.hasMany(Demorado);
  Pedido.hasOne(Confirmado);
  Pedido.hasOne(Entregado);
  Pedido.hasOne(Cancelado);
  Pedido.hasOne(Fabricando);
  Pedido.hasOne(Facturado);
  Pedido.hasOne(Finalizado);
  Pedido.hasOne(Pago);
  Pedido.hasOne(Presupuestado);
  Pedido.belongsTo(Persona);
  sequelize.models.Demorado.belongsTo(Pedido);
  Pedido.belongsToMany(sequelize.models.Empleado, {
    through: PedidoEmpleado,
  });

  sequelize.models.Empleado.belongsToMany(Pedido, {
    through: PedidoEmpleado,
  });
  //Dinosaurio.hasMany(Hueso, { foreignKey: 'DinosaurioId' });
  //Hueso.belongsTo(Dinosaurio);
  Hueso.hasMany(Detalle, { foreignKey: 'HuesoId' });
  Detalle.belongsTo(Hueso);
  return Pedido;
};
