'use strict';

const MAX_PEDIDOS = 300; // Cantidad máxima de pedidos
const MAX_DETALLES_POR_PEDIDO = 5; // Cantidad máxima de detalles por pedido

const START_ID_PRESUPUESTADOS = 1;
const END_ID_PRESUPUESTADOS = 150;

const START_ID_CANCELADOS = 1;
const END_ID_CANCELADOS = 50;

const START_ID_CONFIRMADOS = 51;
const END_ID_CONFIRMADOS = 300;

const START_ID_FABRICANDOS = 51;
const END_ID_FABRICANDOS = 300;

const START_ID_DEMORADOS = 51;
const END_ID_DEMORADOS = 100;

const START_ID_FINALIZADOS = 101;
const END_ID_FINALIZADOS = 300;

// Esto es asi porque solo los primeros 150 son presupuestados
const START_ID_ENTREGADOS = 101;
const END_ID_ENTREGADOS = 150;

function getRandomDateWithinFourMonths() {
  const currentDate = new Date();
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(currentDate.getMonth() - 4);
  const randomTime = Math.random() * (currentDate.getTime() - fourMonthsAgo.getTime());
  return new Date(fourMonthsAgo.getTime() + randomTime);
}

function generarMoneda() {
  const monedas = ['Pesos Argentinos', 'Dólares', 'Euros'];
  return monedas[Math.floor(Math.random() * monedas.length)];
}

function generarMotivoDemora() {
  const motivos = ['Falta De Material', 'Falta De Presupuesto', 'Falta De Personal', 'Otros'];
  return motivos[Math.floor(Math.random() * motivos.length)];
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const pedidos = [];
    const detalles = [];
    const pedidosDates = []; // Array para guardar las fechas generadas

    // Insertar registros en la tabla 'Pedidos'
    for (let pedidoId = 1; pedidoId <= MAX_PEDIDOS; pedidoId++) {
      const randomDate = getRandomDateWithinFourMonths();
      const pedido = {
        autorizacion: true,
        motivo: '',
        tipo: pedidoId <= MAX_PEDIDOS / 2 ? 'Externo' : 'Interno',
        PersonaId: pedidoId <= MAX_PEDIDOS / 2 ? pedidoId : null,
        createdAt: randomDate,
        updatedAt: randomDate,
        deletedAt: null,
      };
      pedidos.push(pedido);
      pedidosDates.push(randomDate); // Guardar la fecha generada
    }

    // Insertar registros en la tabla 'Detalles' y usar los IDs generados de 'Pedidos'
    for (let pedidoId = 1; pedidoId <= MAX_PEDIDOS; pedidoId++) {
      const numDetalles = Math.floor(Math.random() * (MAX_DETALLES_POR_PEDIDO - 2) + 2); // Número aleatorio entre 2 y 5

      for (let i = 0; i < numDetalles; i++) {
        const randomDate = getRandomDateWithinFourMonths();
        const detalle = {
          cantidad: Math.floor(Math.random() * 10) + 1,
          PedidoId: pedidoId,
          HuesoId: Math.floor(Math.random() * 9) + 1,
          renglon: i + 1,
          createdAt: randomDate,
          updatedAt: randomDate,
        };
        detalles.push(detalle);
      }
    }

    // Insertar registros en la tabla 'Pedidos'
    await queryInterface.bulkInsert('Pedidos', pedidos, {});

    // Insertar registros en la tabla 'Detalles'
    await queryInterface.bulkInsert('Detalles', detalles, {});

    // Obtener los primeros 300 pedidos
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

    const pedidosConfirmados = await Pedido.findAll({
      attributes: ['id', 'createdAt'],
      where: {
        id: {
          [Sequelize.Op.gte]: START_ID_CONFIRMADOS,
          [Sequelize.Op.lte]: END_ID_CONFIRMADOS,
        },
      },
    });
    
    let confirmadoArr = pedidosConfirmados.map(pedido => {
      const fechaPedidoMasUnDia = new Date(pedido.createdAt.getTime() + 24 * 60 * 60 * 1000 * 2); // Fecha del pedido + 2 día
      return {
      descripcion: 'Confirmado',
      fecha: fechaPedidoMasUnDia, // Fecha del pedido + 1 día
      PedidoId: pedido.id,
      createdAt: fechaPedidoMasUnDia,
      updatedAt: fechaPedidoMasUnDia, // Fecha del pedido + 1 día
      deletedAt: null,
      }
    });

    await queryInterface.bulkInsert('Confirmados', confirmadoArr, {});

    // Obtener los primeros 150 pedidos para presupuestados
    const pedidosPresupuestados = await Pedido.findAll({
      attributes: ['id', 'createdAt'],
      where: {
        id: {
          [Sequelize.Op.gte]: START_ID_PRESUPUESTADOS,
          [Sequelize.Op.lte]: END_ID_PRESUPUESTADOS,
        },
      },
    });

    let presupuestadoArr = pedidosPresupuestados.map(pedido => ({
      descripcion: 'Presupuestado',
      fecha: pedido.createdAt, // Mismo día que el pedido
      cantidad_huesos: 43,
      monto: Math.round(Math.random() * 20000) + 1000,
      moneda: generarMoneda(),
      fecha_fin_oferta: new Date(),
      PedidoId: pedido.id,
      createdAt: pedido.createdAt,
      updatedAt: pedido.createdAt, // Mismo día que el pedido
      deletedAt: null,
    }));

    await queryInterface.bulkInsert('Presupuestados', presupuestadoArr, {});

    // Cancelar los primeros 50 pedidos presupuestados
    const pedidosCancelados = await Pedido.findAll({
      attributes: ['id', 'createdAt'],
      where: {
        id: {
          [Sequelize.Op.gte]: START_ID_CANCELADOS,
          [Sequelize.Op.lt]: END_ID_CANCELADOS,
        },
      },
    });

    let canceladoArr = pedidosCancelados.map((pedido, index) => {
      const fechaPedidoMasUnDia = new Date(pedido.createdAt.getTime() + 24 * 60 * 60 * 1000); // Fecha del pedido + 1 día
      return {
      fecha_baja: fechaPedidoMasUnDia, // Fecha del pedido + 1 día
      obs: `Cancelado Observacion ${START_ID_CANCELADOS + index}`,
      fecha: fechaPedidoMasUnDia, // Fecha del pedido + 1 día
      descripcion: 'Cancelado',
      PedidoId: pedido.id,
      createdAt: fechaPedidoMasUnDia,
      updatedAt: fechaPedidoMasUnDia, // Fecha del pedido + 1 día
      deletedAt: null,
    }});

    await queryInterface.bulkInsert('Cancelados', canceladoArr, {});

    // Obtener los pedidos del 202 al 212 para fabricandos
    const pedidosFabricandos = await Pedido.findAll({
      attributes: ['id', 'createdAt'],
      where: {
        id: {
          [Sequelize.Op.gte]: START_ID_FABRICANDOS,
          [Sequelize.Op.lte]: END_ID_FABRICANDOS,
        },
      },
    });

    let fabricandoArr = pedidosFabricandos.map(pedido => {
      const fechaPedidoMasTresDias = new Date(pedido.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000); // Fecha del pedido + 3 días
      const inicioEstimada = new Date(
        fechaPedidoMasTresDias.getFullYear(),
        fechaPedidoMasTresDias.getMonth(),
        fechaPedidoMasTresDias.getDate()
      );
      const finEstimada = new Date(
        inicioEstimada.getTime() + (Math.floor(Math.random() * 8) + 7) * 24 * 60 * 60 * 1000
      ); // Fecha inicio estimada + 7-14 días

      return {
        descripcion: 'Fabricando',
        fecha: fechaPedidoMasTresDias,
        cantidad_empleados: Math.floor(Math.random() * 10) + 3, // Número aleatorio entre 3 y 12
        inicio_estimada: inicioEstimada,
        fin_estimada: finEstimada,
        PedidoId: pedido.id,
        createdAt: fechaPedidoMasTresDias,
        updatedAt: fechaPedidoMasTresDias,
      };
    });

    await queryInterface.bulkInsert('Fabricandos', fabricandoArr, {});

    // Obtener los pedidos del 213 al 233 para demorados
    const pedidosDemorados = await Pedido.findAll({
      attributes: ['id', 'createdAt'],
      where: {
        id: {
          [Sequelize.Op.gte]: START_ID_DEMORADOS,
          [Sequelize.Op.lte]: END_ID_DEMORADOS,
        },
      },
    });

    let demoradoArr = pedidosDemorados.map(pedido => {
      const fechaPedidoMasCuatroDias = new Date(pedido.createdAt.getTime() + 4 * 24 * 60 * 60 * 1000); // Fecha del pedido + 4 días

      return {
        descripcion: 'Demorado',
        fecha: fechaPedidoMasCuatroDias,
        motivo_demora: generarMotivoDemora(),
        PedidoId: pedido.id,
        createdAt: fechaPedidoMasCuatroDias,
        updatedAt: fechaPedidoMasCuatroDias,
      };
    });

    await queryInterface.bulkInsert('Demorados', demoradoArr, {});

    // Obtener los pedidos del 234 al 259 para finalizados
    const pedidosFinalizados = await Pedido.findAll({
      attributes: ['id', 'createdAt'],
      where: {
        id: {
          [Sequelize.Op.gte]: START_ID_FINALIZADOS,
          [Sequelize.Op.lte]: END_ID_FINALIZADOS,
        },
      },
    });

    let finalizadoArr = pedidosFinalizados.map(pedido => {
      const fechaPedidoMasCincoDias = new Date(pedido.createdAt.getTime() + 5 * 24 * 60 * 60 * 1000); // Fecha del pedido + 3 días
      const finalizacion = new Date(
        fechaPedidoMasCincoDias.getFullYear(),
        fechaPedidoMasCincoDias.getMonth(),
        fechaPedidoMasCincoDias.getDate()
      );

      return {
        fecha: fechaPedidoMasCincoDias,
        finalizacion: finalizacion,
        PedidoId: pedido.id,
        createdAt: fechaPedidoMasCincoDias,
        updatedAt: fechaPedidoMasCincoDias,
      };
    });

    await queryInterface.bulkInsert('Finalizados', finalizadoArr, {});

    // Obtener los pedidos del 260 al 300 para entregados
    const pedidosEntregados = await Pedido.findAll({
      attributes: ['id', 'createdAt'],
      where: {
        id: {
          [Sequelize.Op.gte]: START_ID_ENTREGADOS,
          [Sequelize.Op.lte]: END_ID_ENTREGADOS,
        },
      },
    });

    let entregadoArr = pedidosEntregados.map(pedido => {
      const fechaPedidoMasSeisDias = new Date(pedido.createdAt.getTime() + 6 * 24 * 60 * 60 * 1000); // Fecha del pedido + 4 días
      const fechaEnvio = new Date(
        fechaPedidoMasSeisDias.getFullYear(),
        fechaPedidoMasSeisDias.getMonth(),
        fechaPedidoMasSeisDias.getDate()
      );
      const fechaEntrega = new Date(fechaEnvio.getTime() + (Math.floor(Math.random() * 8) + 7) * 24 * 60 * 60 * 1000); // Fecha envio + 7-14 días

      return {
        fecha: fechaPedidoMasSeisDias,
        fecha_envio: fechaEnvio,
        fecha_entrega: fechaEntrega,
        PedidoId: pedido.id,
        createdAt: fechaPedidoMasSeisDias,
        updatedAt: fechaPedidoMasSeisDias,
      };
    });

    await queryInterface.bulkInsert('Entregados', entregadoArr, {});
  },
};
