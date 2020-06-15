const express = require('express')
const router = express.Router()
const clienteService = require('../services/cliente')
const personaService = require('../services/persona')
const { generatePagination } = require('../services/utils')
const paginate = require('../middlewares/paginate')


//lista todos los clientes
router.get('/', paginate, async (req, res) => {
  const { page, limit } = req.query
  try {
    const clientes = await clienteService.getClientes(page, limit)
    const paginationObj = {
      ...generatePagination('clientes', clientes.count, page, limit)
    }
    res.render('clientes/cliente', { results: clientes.rows, paginationObj, req })
  } catch (error) {
    res.redirect('/404')
  }
})

router.get('/agregar', (req, res) => {
  res.render('clientes/agregar', { req })
})

router.get('/editar/:id', async (req, res) => {
  const { id } = req.params
  try {
    const cliente = await clienteService.getCliente(id)
    res.render('clientes/editar', { cliente, req })
  } catch (error) {
    res.redirect('/404')
  }
})

router.get('/eliminar/:id', async (req, res) => {
  const { id } = req.params
  try {
    const cliente = await clienteService.getCliente(id)
    res.render('clientes/eliminar', { cliente, req })
  } catch (error) {
    res.redirect('/404')
  }
})

router.post('/', async (req, res) => {
  const { identificacion, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono, tipoCliente, PersonaId, tipo } = req.body

  try {
    const persona = await personaService.createPersona(identificacion, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono)
    const cliente = await clienteService.createClienteExiste(tipoCliente, persona.id)
  } catch (error) {
    try {
      const persona = await personaService.getPersonaArgs({ identificacion })
      await clienteService.createClienteExiste(tipoCliente, persona.id)
      res.redirect('/clientes')
    } catch (error) {
      errores = error
      res.render("clientes/agregar", { errores: error, req })
    }
  }
})

router.put('/', (req, res) => {
  const { idPersona, identificacion, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono, idCliente, tipoCliente } = req.body
  const persona = {
    id: idPersona,
    identificacion: identificacion,
    nombre: nombre,
    apellido: apellido,
    direccion: direccion,
    localidad: localidad,
    email: email,
    fecha_nacimiento: fecha_nacimiento,
    telefono: telefono
  }
  const cliente = { id: idCliente, tipo: tipoCliente }
  return clienteService.updateCliente(cliente)
    .then(() => {
      personaService.updatePersona(persona)
        .then(() => {
          res.redirect('/clientes')
        })
    })
})

router.delete('/', async (req, res) => {
  const { id } = req.body
  try {
    await clienteService.deleteCliente(id)
    res.redirect('/clientes')
  } catch (error) {
    res.redirect('/404')
  }
})

module.exports = router