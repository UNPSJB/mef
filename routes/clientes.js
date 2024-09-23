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
    let mensajeCreate;
    let mensajeEdit;
    if (success === 'create') {
      mensajeCreate = 'Cliente agregado con éxito.';
    }
    if (success === 'createExist') {
      mensajeCreate = 'Cliente agregado con éxito. Se tomo la información del cliente existente.';
    }
    if (success === 'edit') {
      mensajeEdit = 'Cliente editado con éxito.';
    }
    res.render('clientes/cliente', {
      results: clientes,
      req,
      success: mensajeCreate || mensajeEdit, // enviar el mensaje adecuado
    });
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
  let mensajeExito = 'create';
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
    res.redirect(`/clientes?success=${mensajeExito}`);
  } catch (error) {
    try {
      const persona = await personaService.getPersonaArgs({ identificacion });
      await clienteService.createClienteExiste(tipoCliente, persona.id);
      mensajeExito = 'createExist';
      res.redirect(`/clientes?success=${mensajeExito}`);
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
    res.redirect('/clientes?success=edit');
  } catch (error) {
    const { message } = error.errors[0];
    const cliente = await clienteService.getCliente(idCliente);
    res.render('clientes/editar', { errores: message, cliente, req });
  }
});

module.exports = router;
