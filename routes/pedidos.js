const express = require('express');
const router = express.Router();
const permisos = require('../middlewares/permisos');
const dinoService = require('../services/dinosaurio');
const pedidosService = require('../services/pedidos');
const replicaService = require('../services/replicas');
const huesoService = require('../services/hueso');
const personaService = require('../services/persona');
const empleadoService = require('../services/empleado');
const clienteService = require('../services/cliente');
const models = require('../models');
const schedule = require('node-schedule');

const { generatePagination } = require('../services/utils');
const paginate = require('../middlewares/paginate');

router.get('/', async (req, res) => {
  const { success } = req.query;
  try {
    const pedidos = await pedidoService.getAllPedidos(
      {},
      {
        raw: true,
        nest: true,
      }
    );
    let mensajeCreate;
    if (success === 'create') {
      mensajeCreate = 'Pedido agregado con éxito.';
    }
    res.render('pedidos/pedido', {
      results: pedidos,
      req,
      success: mensajeCreate,
    });
  } catch (error) {
    console.error(error);
    res.redirect('/404');
  }
});

router.get('/list', async (req, res) => {
  const total = await pedidosService.countPedidos();
  const { start, length, draw, search, columns, order } = req.query;
  const pedidos = await pedidosService.getPedidosDataTable({ start, length, search, columns, order });
  let totalpedidosFiltrados = 0;
  if (pedidos && pedidos.length && pedidos[0].recordfilterd) {
    totalpedidosFiltrados = pedidos[0].recordfilterd;
  }

  res.json({ draw, data: pedidos, recordsTotal: total, recordsFiltered: totalpedidosFiltrados });
});

router.get('/agregar', async (req, res) => {
  try {
    const dinosaurios = await dinoService.getAllDinosaurios();
    const clientes = await clienteService.getAllClientes({}, { raw: true, nest: true });
    res.render('pedidos/agregar', { dinosaurios, clientes, req });
  } catch (error) {
    // pagina 500 ?
    console.error(error);
  }
});

router.get('/:id/empleados/', async (req, res) => {
  const { id } = req.params;
  const pedido = await pedidosService.getPedido({ id });
  const trabajando = await pedido.getEmpleados({ include: [models.Persona] });
  res.send(JSON.stringify(trabajando, null, 4));
});

router.get('/replicas', async (req, res) => {
  const dinosauriosConReplicas = await replicaService.getReplicas();
  const pedidos = dinosauriosConReplicas.map(pedido => {
    const dino = pedido.Replicas[0].Dinosaurio;
    pedido.dino = dino;
    return pedido;
  });
  res.render('replicas/replica', { pedidos, req });
});

router.get('/detalle/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await pedidosService.getPedido({ id });
    const cantidadEmpleadosAsignados = pedido.Empleados.length;
    const estado = await pedido.estado;
    const estadosPedido = await pedido.estados;
    const detalles = await pedido.getDetalles({
      include: [
        {
          model: models.Hueso,
          include: [models.Dinosaurio],
        },
      ],
      raw: true,
      nest: true,
    });

    const presupuestado = await pedido.getPresupuestado();
    let estados = [];
    estadosPedido.forEach(estado => {
      estado.estadoInstance = estado.constructor.name;
      estados.push({ ...estado.dataValues, estadoInstance: estado.constructor.name });
    });
    const estadoInstance = estado.constructor.name;
    const hueso = await huesoService.getHueso(detalles[0].HuesoId);
    const dinosaurio = JSON.parse(JSON.stringify(hueso.Dinosaurio));
    res.render('pedidos/detalle', {
      id,
      estadoInstance,
      presupuestado,
      estados,
      pedido,
      dinosaurio,
      hueso,
      detalles,
      cantidadEmpleadosAsignados,
      req,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/pedidos');
  }
});
// models.Dinosaurio
router.get('/:accion/:id', permisos.permisosParaEstado(), async (req, res) => {
  const { accion, id } = req.params;
  try {
    const pedido = await pedidosService.getPedido({ id });
    const detalles = await pedido.getDetalles({ include: [models.Pedido, models.Hueso] });
    const estado = await pedido.estado;
    res.render(`pedidos/${accion}`, { accion, id, detalles, pedido, estado, req });
  } catch (e) {
    //@TODO que hacer
    console.log(e);
    res.redirect('/pedidos');
  }
});

router.get('/empleados', async (req, res) => {
  try {
    const empleados = await empleadoService.getAllEmpleados();
    res.send(JSON.stringify(empleados, null, 4));
  } catch (err) {
    console.log(err);
  }
});

router.post('/:nuevoEstado/:id', async (req, res) => {
  const { nuevoEstado, id } = req.params;
  try {
    const pedido = await pedidosService.getPedido({ id });
    console.log('MI PEDIDO', pedido.cambiarEstado);

    // transicion a nuevo estado
    await pedido.cambiarEstado(nuevoEstado, req.body);
    res.redirect('/pedidos');
  } catch (error) {
    /**
     * @TODO agregar una vista de que no se puede hacer
     */
    console.log('log error::::::', error, nuevoEstado, id);
    res.redirect('/404');
  }
});
router.put('/', async (req, res) => {
  try {
    const { idPedido, empleado } = req.body;
    const pedido = await pedidosService.getPedido({ id: idPedido });
    await pedido.setEmpleados(empleado);
    res.redirect('/pedidos');
  } catch (e) {
    console.error(e);
  }
});

router.post('/', async (req, res) => {
  const { hueso, cliente, descripcion, monto, finoferta, moneda } = req.body;

  if (cliente === 'Interno') {
    await pedidosService.solicitar(hueso);
  } else {
    await pedidosService.presupuestar(hueso, cliente, descripcion, monto, finoferta, moneda);
  }
  res.redirect('/empleados?success=create'); // redirección con mensaje de creación
});
/**
 * @TODO revisar esto
 */
schedule.scheduleJob('*/3 * * * *', async function () {
  //cada cinco segundo
  let d = new Date();
  let n = d.getFullYear().toString() + '-' + d.getMonth().toString() + '-' + d.getDate().toString();
  let nuevo = new Date(n);
  pedidosService.getPresupuestados().then(pedidos => {
    pedidos.forEach(async pedido => {
      const presupuestado = await pedido.getPresupuestado();
      if (new Date(presupuestado.fecha_fin_oferta) - nuevo < 0) {
        // si la fecha de hoy es mas grande que la fecha de fin de oferta, cancelar
        presupuestado.cancelar(pedido, {});
      } else {
        console.log('pedido por vencer:');
        console.log(pedido.dataValues);
        console.log(presupuestado.dataValues);
      }
    });
  });
});

module.exports = router;
