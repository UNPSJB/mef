const express = require('express')
const router = express.Router()
const permisos = require('../middlewares/permisos')
const dinoService = require('../services/dinosaurio')
const pedidosService = require('../services/pedidos')
const replicaService = require('../services/replicas')
const huesoService = require('../services/hueso')
const personaService = require('../services/persona')
const empleadoService = require('../services/empleado')
const clienteService = require('../services/cliente')
const models = require('../models')
const schedule = require('node-schedule')

const { generatePagination } = require('../services/utils')
const paginate = require('../middlewares/paginate')

router.get('/',
  async (req, res) => {
    // https://flaviocopes.com/javascript-async-await-array-map/
    const pedidosPromesa = await pedidosService.getAllPedidos()
    const pedidosFunc = async () => {
      return Promise.all(pedidosPromesa.map(async pedido => {
        pedido.estadoActual = await pedido.estado
        pedido.estadoInstance = pedido.estadoActual.constructor.name
        return pedido
      }))
    }
    const pedidos = await pedidosFunc()
    res.render('pedidos/lista', { pedidos, req })
  })
router.get('/agregar',
  (req, res) => {
    dinoService.getAllDinosaurios().then((dinosaurios) => {
      clienteService.getAllClientes().then(clientes => {
        // cambiar a todos los clientes y todos los dinosaurios
        res.render('pedidos/agregar', { dinosaurios, clientes, req })
      })
    })
  })

router.get('/:id/empleados/', async (req, res) => {
  const { id } = req.params
  const pedido = await pedidosService.getPedido({ id })
  const trabajando = await pedido.getEmpleados({ include: [models.Persona] })
  res.send(JSON.stringify(trabajando, null, 4))
})

router.get('/replicas', async (req, res) => {
  const replicas = await replicaService.getReplicas()
  // TODO Invertir consulta para traer solo los dinos que tengan replicas, para poder separarlos en diferentes tablas 
  res.render("replicas/replica", { replicas, req })
})

router.get('/detalle/:id', (req, res) => {
  const { id } = req.params
  pedidosService.getPedido({ id }).then(async pedido => {
    const estado = await pedido.estado
    const estadosPedido = await pedido.estados
    const detalles = await pedido.getDetalles({ include: [models.Hueso] })
    const presupuestado = await pedido.getPresupuestado()
    const estados = estadosPedido.map(estado => {
      estado.estadoInstance = estado.constructor.name
      return estado
    })

    const estadoInstance = estado.constructor.name
    const hueso = await huesoService.getHueso(detalles[0].HuesoId)
    const dinosaurio = hueso.Dinosaurio
    res.render("pedidos/detalle", { id, estadoInstance, presupuestado, estados, pedido, dinosaurio, hueso, detalles, req })
  })

})
// models.Dinosaurio
router.get('/:accion/:id',
  permisos.permisosParaEstado(),
  (req, res) => {
    const { accion, id } = req.params
    try {
      pedidosService.getPedido({ id }).then(async pedido => {
        const detalles = await pedido.getDetalles({ include: [models.Pedido, models.Hueso] })
        const estado = await pedido.estado
        res.render(`pedidos/${accion}`, { accion, id, detalles, pedido, estado, req })
      })
    } catch (e) {//@TODO que hacer
      res.redirect('/404')
    }
  })

router.get('/empleados', (req, res) => {
  try {
    return empleadoService.getAllEmpleados()
      .then((empleados) => {
        res.send(JSON.stringify(empleados, null, 4))
      })
  } catch (err) {
    console.log(err)
  }
})

router.post('/:accion/:id', (req, res) => {
  const { accion, id } = req.params

  pedidosService.getPedido({ id }).then(async (pedido) => {
    try {
      await pedido.hacer(accion, req.body)
    } catch (error) {
      /**
       * @TODO agregar una vista de que no se puede hacer
       */
      console.log("log error::::::", error)
    }
  })
    .then(() => res.redirect('/pedidos'))
    .catch(() => { res.redirect('/404') })
})
router.put('/', async (req, res) => {
  const { idPedido, empleado } = req.body
  let pedido = await pedidosService.getPedido({ id: idPedido })
  let empleados = []
  const getEmpleados = async () => {
    return Promise.all(
      empleado.map(async empl => {
        const empleado = await empleadoService.getEmpleado(empl)
        return empleado
      })
    )
  }

  if (Array.isArray(empleado))
    empleados = await getEmpleados()
  else
    empleados = await empleadoService.getEmpleado(empleado)
  /** @todo agregar try catch, render con pedidos, elecciones, request */
  await pedido.setEmpleados(empleados)
  res.redirect('/pedidos')
})

router.post('/', (req, res) => {
  const { hueso, cliente, descripcion, monto, finoferta, moneda } = req.body
  /** @TODO agregar async await, y la vista de error */
  if (cliente === "Interno") {
    pedidosService.solicitar(hueso).then(e => res.redirect('/pedidos'))
  } else {
    pedidosService.presupuestar(hueso, cliente, descripcion, monto, finoferta, moneda).then(e => res.redirect('/pedidos'))
  }
})
/**
 * @TODO revisar esto
*/
schedule.scheduleJob('*/3 * * * *', async function () { //cada cinco segundo
  let d = new Date()
  let n = d.getFullYear().toString() + '-' + d.getMonth().toString() + '-' + d.getDate().toString()
  let nuevo = new Date(n)
  pedidosService.getPresupuestados().then(pedidos => {
    pedidos.forEach(async pedido => {
      const presupuestado = await pedido.getPresupuestado()
      if ((new Date(presupuestado.fecha_fin_oferta) - nuevo) < 0) { // si la fecha de hoy es mas grande que la fecha de fin de oferta, cancelar
        presupuestado.cancelar(pedido, {})
      } else {
        console.log('pedido por vencer:')
        console.log(pedido.dataValues)
        console.log(presupuestado.dataValues)
      }
    })
  })
})

module.exports = router