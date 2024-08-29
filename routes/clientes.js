const express = require('express');
const router = express.Router();
const clienteService = require('../services/cliente');
const personaService = require('../services/persona');
const { generatePagination } = require('../services/utils');
const paginate = require('../middlewares/paginate');
const { sequelize } = require('../models');

//lista todos los clientes
router.get('/', async (req, res) => {
  const { success } = req.query;
  try {
    const clientes = await clienteService.getAllClientes(
      {},
      {
        raw: true,
        nest: true,
      }
    );
    let mensajeExito;
    let mensajeError;
    if (success === 'create') {
      mensajeExito = 'Cliente agregado con éxito';
    }
    if (success === 'edit') {
      mensajeExito = 'Cliente editado con éxito';
    }
    if (success === 'delete') {
      mensajeExito = 'Cliente eliminado con éxito';
    }
    res.render('clientes/cliente', { results: clientes, req, success: mensajeExito });
  } catch (error) {
    res.redirect('/404');
  }
});
router.get('/list', async (req, res) => {
  try {
    const total = await clienteService.countClientes();
    const { start, length, draw, search, columns, order } = req.query;
    const { clientes, recordsFiltered } = await clienteService.getClientesDataTable({
      start,
      length,
      search,
      columns,
      order,
    });
    res.json({ draw, data: clientes, recordsTotal: total, recordsFiltered: recordsFiltered });
  } catch (error) {
    res.redirect('/404');
  }
});

router.get('/agregar', (req, res) => {
  res.render('clientes/agregar', { req });
});

router.get('/editar/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await clienteService.getCliente(id, { raw: true, nest: true });
    const { tipo } = cliente;
    const [particular, institucional] = [tipo === 'Particular', tipo === 'Institucional'];

    res.render('clientes/editar', { particular, institucional, cliente, req });
  } catch (error) {
    res.redirect('/404');
  }
});

router.get('/eliminar/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = req.query;
  try {
    const cliente = await clienteService.getCliente(id, { raw: true, nest: true });
    let mensajeError = '';
    if (error) {
      mensajeError = 'No se puede eliminar el cliente ya que tiene pedidos asociados';
    }
    res.render('clientes/eliminar', { cliente, req, errores: mensajeError });
  } catch (error) {
    res.redirect('/404');
  }
});

router.post('/', async (req, res) => {
  const {
    identificacion,
    nombre,
    apellido,
    direccion,
    localidad,
    email,
    fecha_nacimiento,
    telefono,
    tipoCliente,
    PersonaId,
    tipo,
  } = req.body;

  try {
    const persona = await personaService.createPersona(
      identificacion,
      nombre,
      apellido,
      direccion,
      localidad,
      email,
      fecha_nacimiento,
      telefono
    );
    const cliente = await clienteService.createClienteExiste(tipoCliente, persona.id);
    res.redirect('/clientes?success=create');
  } catch (error) {
    try {
      const persona = await personaService.getPersonaArgs({ identificacion });
      await clienteService.createClienteExiste(tipoCliente, persona.id);
      res.redirect('/clientes');
    } catch (error) {
      /** @TODO agregar objeto persona y cliente */
      const { message } = error.errors[0];
      res.render('clientes/agregar', { errores: message, cliente: req.body, req });
    }
  }
});

router.put('/', async (req, res) => {
  const { idPersona, idCliente, tipoCliente } = req.body;
  //** @TODO agregar try catch y render de la vista de error */
  try {
    const clienteDB = await clienteService.getCliente(idCliente);
    await clienteDB.update({
      tipo: tipoCliente,
    });
    const personaDB = await personaService.getPersona(idPersona);
    await personaDB.update({
      ...req.body,
    });
    res.redirect('/clientes');
  } catch (error) {
    const { message } = error.errors[0];
    const cliente = await clienteService.getCliente(idCliente);
    res.render('clientes/editar', { errores: message, cliente, req });
  }
});

router.delete('/', async (req, res) => {
  const { id } = req.body;
  try {
    const cliente = await clienteService.getCliente(id);
    const pedidos = await sequelize.models.Pedido.findAll({ where: { PersonaId: cliente.Persona.id } });
    if (pedidos.length) {
      return res.redirect(`clientes/eliminar/${id}?error=1`);
    }
    await clienteService.deleteCliente(id);
    return res.redirect('/clientes');
  } catch (error) {
    res.redirect('/404');
  }
});

module.exports = router;
