'use strict';
const MAX = 150;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define el modelo Pedido
    const Pedido = queryInterface.sequelize.define(
      'Pedido',
      {
        createdAt: {
          type: Sequelize.DATE,
        },
      },
      {
        tableName: 'Pedidos',
        timestamps: false,
      }
    );

    // Obtén los primeros 150 pedidos
    const pedidos = await Pedido.findAll({
      attributes: ['id', 'createdAt'],
      where: {
        id: {
          [Sequelize.Op.lte]: MAX,
        },
      },
    });

    // Función para generar moneda aleatoria
    const generarMoneda = () => {
      const monedas = ['Pesos Argentinos', 'Dolares', 'Euros'];
      return monedas[Math.floor(Math.random() * monedas.length)];
    };

    // Construye el array presupuestadoArr
    let presupuestadoArr = pedidos.map(pedido => ({
      descripcion: 'Presupuestado',
      fecha: new Date(),
      cantidad_huesos: 43,
      monto: Math.round(Math.random() * 20000) + 1000,
      moneda: generarMoneda(),
      fecha_fin_oferta: new Date(), // Aquí podrías ajustar para poner fechas vencidas o futuras
      PedidoId: pedido.id,
      createdAt: pedido.createdAt,
      updatedAt: new Date(),
      deletedAt: null,
    }));

    // Inserta en la tabla Presupuestados
    return queryInterface.bulkInsert('Presupuestados', presupuestadoArr, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Agrega comandos de reversión aquí.
      Retorna una promesa para manejar la asincronía correctamente.

      Ejemplo:
      return queryInterface.bulkDelete('Presupuestados', null, {});
    */
  },
};
