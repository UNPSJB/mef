const models = require('../models');
const INTERNO = 'Interno';
const EXTERNO = 'Externo';
const CONFIRMADO = 'Confirmado';
const PRESUPUESTADO = 'Presupuestado';
const { paginateModel } = require('./utils');
const { Op, literal } = require('sequelize');
const MIN_CHARS = 1;
const genericSearch = (search, fields) => {
  return fields.map(field => {
    if (field === 'Dinosaurio.nombre') {
      console.log('Entreeee', field);
      return literal(`"Detalles->Hueso->Dinosaurio"."nombre" ILIKE '%${search}%'`);
    }
    if (field === 'createdAt') {
      // Si el campo es fecha_nacimiento, comparamos solo por año, mes o día utilizando LIKE
      return literal(`TO_CHAR("Pedido"."createdAt", 'DD-MM-YYYY') LIKE '%${search}%'`);
    }
    return literal(`"Pedido"."${field}"::text ILIKE '%${search}%'`);
  });
};

function obtenerDinosaurio(detalles) {
  try {
    const [primeretalle] = detalles;
    return primeretalle.Hueso.Dinosaurio;
  } catch (error) {
    console.error('Error al obtener los detalles del pedido:', error);
    return null;
  }
}
module.exports = {
  getAllPedidos(args, opts = {}) {
    return models.Pedido.findAll({
      include: [models.Persona],
      where: {
        ...args,
      },
      order: [['createdAt', 'DESC']],
    });
  },
  countPedidos() {
    return models.Pedido.count();
  },
  getPedidos(page = 0, pageSize = 10, args) {
    return models.Pedido.findAll({
      include: [models.Persona],
      where: {
        ...args,
      },
      order: [['createdAt', 'DESC']],
      ...paginateModel({ page, pageSize }),
    });
  },
  async buscarAnosPedidosDemorados() {
    const [result] = await models.sequelize.query(
      `SELECT DISTINCT EXTRACT(YEAR FROM "Demorados"."createdAt") AS year
      FROM "Pedidos" AS "Pedido"
      LEFT JOIN LATERAL 
        (SELECT * FROM "Demorados" WHERE "Demorados"."PedidoId" = "Pedido"."id" ORDER BY "Demorados"."createdAt" DESC LIMIT 1) AS "Demorados"
        ON "Pedido"."id" = "Demorados"."PedidoId"
      WHERE "Demorados"."createdAt" IS NOT NULL
      ORDER BY year`
    );

    return result.map(row => row.year);
  },
  async getPedidosDemorados() {
    const [result] = await models.sequelize.query(
      `SELECT
        COUNT("Demorado"."id") AS total_pedidos_demorados,
        SUM(CASE WHEN "Demorado"."motivo_demora" = 'Falta De Personal' THEN 1 ELSE 0 END) AS falta_de_personal,
        SUM(CASE WHEN "Demorado"."motivo_demora" = 'Falta De Material' THEN 1 ELSE 0 END) AS falta_de_material,
        SUM(CASE WHEN "Demorado"."motivo_demora" = 'Falta De Presupuesto' THEN 1 ELSE 0 END) AS falta_de_presupuesto,
        SUM(CASE WHEN "Demorado"."motivo_demora" = 'Otros' THEN 1 ELSE 0 END) AS otros
      FROM
        "Demorados" AS "Demorado"`,
      { raw: true }
    );

    // Extrae el primer objeto del array y convierte los valores a números
    const data = result[0] || {};
    return {
      total_pedidos_demorados: parseInt(data.total_pedidos_demorados, 10),
      falta_de_personal: parseInt(data.falta_de_personal, 10),
      falta_de_material: parseInt(data.falta_de_material, 10),
      falta_de_presupuesto: parseInt(data.falta_de_presupuesto, 10),
      otros: parseInt(data.otros, 10),
    };
  },
  async getPedidosDataTable({ start, length, search, order, columns }) {
    let querySearch = undefined;
    const [orderValue] = order;
    let replacements = { limit: length, offset: start };

    const columnOrder = columns[parseInt(orderValue.column)].data
      .split('.')
      .map(name => `"${name}"`)
      .join('.');

    if (search.value && search.value.length > MIN_CHARS) {
      replacements.searchTerm = `%${search.value}%`;
      querySearch = {
        [Op.or]: genericSearch(search.value, [
          'id',
          'createdAt',
          'motivo',
          'Dinosaurio.nombre',
          'Persona.nombreApellido',
        ]),
      };
    }

    const [pedidos] = await models.sequelize.query(
      `SELECT "Pedido".*,
      COUNT("Pedido"."id") OVER() As recordfilterd,
      ultimo_estado.ultimo_estado,
      dinosaurio.*,
      "Persona"."id" AS "Persona.id",
      "Persona"."nombre" AS "Persona_nombre",
      "Persona"."apellido" AS "Persona_apellido"
      FROM
      (SELECT "Pedido"."id",
      "Pedido"."motivo",
      "Pedido"."createdAt",
      "Pedido"."PersonaId"
      FROM "Pedidos" AS "Pedido") AS "Pedido"
      LEFT OUTER JOIN "Personas" AS "Persona" ON "Pedido"."PersonaId" = "Persona"."id"
      AND ("Persona"."deletedAt" IS NULL)
      LEFT JOIN (
      SELECT CASE
      WHEN GREATEST(CANCELADOS."createdAt",
      CONFIRMADOS."createdAt",
      DEMORADOS."createdAt",
      ENTREGADOS."createdAt",
      FABRICANDOS."createdAt",
      FACTURADOS."createdAt",
      FINALIZADOS."createdAt",
      PRESUPUESTADOS."createdAt") = CANCELADOS."createdAt" THEN 'Cancelado'
      
      WHEN GREATEST(CANCELADOS."createdAt",
      CONFIRMADOS."createdAt",
      DEMORADOS."createdAt",
      ENTREGADOS."createdAt",
      FABRICANDOS."createdAt",
      FACTURADOS."createdAt",
      FINALIZADOS."createdAt",
      PRESUPUESTADOS."createdAt") = CONFIRMADOS."createdAt" THEN 'Confirmado'
      
      WHEN GREATEST(CANCELADOS."createdAt",
      CONFIRMADOS."createdAt",
      DEMORADOS."createdAt",
      ENTREGADOS."createdAt",
      FABRICANDOS."createdAt",
      FACTURADOS."createdAt",
      FINALIZADOS."createdAt",
      PRESUPUESTADOS."createdAt") = DEMORADOS."createdAt" THEN 'Demorado'
      
      WHEN GREATEST(CANCELADOS."createdAt",
      CONFIRMADOS."createdAt",
      DEMORADOS."createdAt",
      ENTREGADOS."createdAt",
      FABRICANDOS."createdAt",
      FACTURADOS."createdAt",
      FINALIZADOS."createdAt",
      PRESUPUESTADOS."createdAt") = ENTREGADOS."createdAt" THEN 'Entregado'
      
      WHEN GREATEST(CANCELADOS."createdAt",
      CONFIRMADOS."createdAt",
      DEMORADOS."createdAt",
      ENTREGADOS."createdAt",
      FABRICANDOS."createdAt",
      FACTURADOS."createdAt",
      FINALIZADOS."createdAt",
      PRESUPUESTADOS."createdAt") = FABRICANDOS."createdAt" THEN 'Fabricando'
      
      WHEN GREATEST(CANCELADOS."createdAt",
      CONFIRMADOS."createdAt",
      DEMORADOS."createdAt",
      ENTREGADOS."createdAt",
      FABRICANDOS."createdAt",
      FACTURADOS."createdAt",
      FINALIZADOS."createdAt",
      PRESUPUESTADOS."createdAt") = FACTURADOS."createdAt" THEN 'Facturado'
      
      WHEN GREATEST(CANCELADOS."createdAt",
      CONFIRMADOS."createdAt",
      DEMORADOS."createdAt",
      ENTREGADOS."createdAt",
      FABRICANDOS."createdAt",
      FACTURADOS."createdAt",
      FINALIZADOS."createdAt",
      PRESUPUESTADOS."createdAt") = FINALIZADOS."createdAt" THEN 'Finalizado'
      
      WHEN GREATEST(CANCELADOS."createdAt",
      CONFIRMADOS."createdAt",
      DEMORADOS."createdAt",
      ENTREGADOS."createdAt",
      FABRICANDOS."createdAt",
      FACTURADOS."createdAt",
      FINALIZADOS."createdAt",
      PRESUPUESTADOS."createdAt") = PRESUPUESTADOS."createdAt" THEN 'Presupuestado'
      END ultimo_estado, p.id as pedido_id
      FROM "Pedidos" as p
      LEFT JOIN "Cancelados" AS CANCELADOS ON CANCELADOS."PedidoId" = "p"."id"
      LEFT JOIN "Confirmados" AS CONFIRMADOS ON CONFIRMADOS."PedidoId" = "p"."id"
      LEFT JOIN LATERAL (SELECT * FROM "Demorados" AS DEMORADOS WHERE DEMORADOS."PedidoId" = "p"."id" ORDER BY DEMORADOS."createdAt" DESC LIMIT 1) as DEMORADOS ON DEMORADOS."PedidoId" = "p"."id"
      LEFT JOIN "Entregados" AS ENTREGADOS ON ENTREGADOS."PedidoId" = "p"."id"
      LEFT JOIN "Fabricandos" AS FABRICANDOS ON FABRICANDOS."PedidoId" = "p"."id"
      LEFT JOIN "Facturados" AS FACTURADOS ON FACTURADOS."PedidoId" = "p"."id"
      LEFT JOIN "Finalizados" AS FINALIZADOS ON FINALIZADOS."PedidoId" = "p"."id"
      LEFT JOIN "Presupuestados" AS PRESUPUESTADOS ON PRESUPUESTADOS."PedidoId" = "p"."id"
      ) as ultimo_estado on ultimo_estado.pedido_id = "Pedido"."id"
      LEFT JOIN (
      SELECT pedido."id" as pedido_id,
      "Detalles->Hueso->Dinosaurio"."nombre" AS "Dinosaurio_nombre"
      FROM "Pedidos" as pedido
      LEFT JOIN (
      SELECT *, ROW_NUMBER() OVER (PARTITION BY "PedidoId" ORDER BY (SELECT NULL)) AS RowNum FROM "Detalles"
      ) as detalle ON pedido."id" = detalle."PedidoId" and RowNum = 1
      AND (detalle."deletedAt" IS NULL)
      LEFT OUTER JOIN "Huesos" AS "Detalles->Hueso" ON detalle."HuesoId" = "Detalles->Hueso"."id"
      AND ("Detalles->Hueso"."deletedAt" IS NULL)
      LEFT OUTER JOIN "Dinosaurios" AS "Detalles->Hueso->Dinosaurio" ON "Detalles->Hueso"."DinosaurioId" = "Detalles->Hueso->Dinosaurio"."id"
      AND ("Detalles->Hueso->Dinosaurio"."deletedAt" IS NULL) WHERE (pedido."deletedAt" IS NULL)
      ) as dinosaurio on dinosaurio.pedido_id = "Pedido"."id"
      ${
        replacements.searchTerm && replacements.searchTerm.length
          ? `WHERE "Pedido"."id"::text ILIKE :searchTerm 
            OR TO_CHAR("Pedido"."createdAt", 'DD-MM-YYYY') LIKE :searchTerm
            OR "Dinosaurio_nombre" ILIKE :searchTerm
            OR ultimo_estado.ultimo_estado LIKE :searchTerm
            OR (("Persona"."nombre" || ' ' || "Persona"."apellido") ILIKE :searchTerm)`
          : ''
      }
      ORDER BY ${columnOrder} ${orderValue.dir}
      
      LIMIT :limit OFFSET :offset;`,
      { raw: true, replacements }
    );
    return pedidos;
  },

  getPedido(args) {
    return models.Pedido.findOne({
      where: {
        ...args,
      },
      include: [
        models.Persona,
        {
          model: models.Empleado,
          include: models.Persona,
        },
        {
          model: models.Detalle,
        },
      ],
    });
  },
  obtenerPedido(id) {
    return models.Pedido.findByPk(id, { include: [persona] });
  },
  getPresupuestados() {
    return models.Pedido.findAll({
      where: {
        tipo: 'Externo',
        autorizacion: false,
      },
    });
  },
  solicitar(huesos) {
    return models.Pedido.create({
      autorizacion: true,
      tipo: INTERNO,
    }).then(pedido => {
      pedido.crearDetalles(huesos);
    });
  },
  presupuestar(huesos, cliente, descripcion, monto, fecha_fin_oferta, moneda) {
    //crea el pedido y sus detalles
    return models.Pedido.create({
      tipo: EXTERNO,
      PersonaId: cliente, //@TODO aca va cliente
      motivo: descripcion,
    }).then(async pedido => {
      //una vez que hayas creado el presupuesto
      //agregarle todos sus ddetalles
      pedido.crearDetalles(huesos);
      const estado = await pedido.estado;
      await estado.update({
        cantidad_huesos: huesos.length,
        monto,
        fecha_fin_oferta,
        moneda,
      });
    });
  },
  updatePedido(pedido) {
    return models.Pedido.upsert(pedido);
  },
  getReplicas(args, options = {}) {
    return models.Replica.findAll({
      where: {
        ...args,
      },
      include: [models.Hueso, models.Dinosaurio],
      ...options,
    });
  },
};
