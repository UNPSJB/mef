const express = require('express');
const router = express.Router();
const empleadoService = require('../services/empleado.js');
const personaService = require('../services/persona.js');
const paginate = require('../middlewares/paginate');
const { generatePagination } = require('../services/utils');

//lista todos los empleados
router.get('/', async (req, res) => {
  const { success } = req.query;
  try {
    const empleados = await empleadoService.getAllEmpleados(
      {},
      {
        raw: true,
        nest: true,
      }
    );
    let mensajeCreate;
    let mensajeEdit
    let mensajeDelete
    if (success === 'create') {
      mensajeCreate = 'Empleado de Taller agregado con éxito.';
    }
    if (success === 'edit') {
      mensajeEdit = 'Empleado de Taller editado con éxito.';
    }
    if (success === 'delete') {
      mensajeDelete = 'Empleado de Taller eliminado con éxito.';
    };
    res.render('empleados/empleado', {
      results: empleados,
      req,
      success: mensajeCreate || mensajeEdit || mensajeDelete, // enviar el mensaje adecuado
    });
  } catch (error) {
    res.redirect('/404');
  }
});

router.get('/list', async (req, res) => {
  try {
    const total = await empleadoService.countEmpleados();
    const { start, length, draw, search, columns, order } = req.query;
    const { empleados, recordsFiltered } = await empleadoService.getEmpleadosDataTable({
      start,
      length,
      search,
      columns,
      order,
    });

    res.json({ draw, data: empleados, recordsTotal: total, recordsFiltered: recordsFiltered });
  } catch (error) {
    res.redirect('/404');
  }
});
router.get('/agregar', (req, res) => {
  res.render('empleados/agregar', { req });
});

router.get('/editar/:id', async (req, res) => {
  const { id } = req.params;
  //ver cuando id no existe
  const empleado = await empleadoService.getEmpleado(id);
  res.render('empleados/editar', { empleado, req });
});

router.get('/eliminar/:id', async (req, res) => {
  const { id } = req.params;
  const empleado = await empleadoService.getEmpleado(id);
  res.render('empleados/eliminar', { empleado, req });
});

router.post('/', async (req, res) => {
  const { identificacion, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono } = req.body;
  try {
    let personaId = 0;
    const persona = await personaService.getPersonaArgs({ identificacion });
    if (!persona) {
      const nuevaPersona = await personaService.createPersona(
        identificacion,
        nombre,
        apellido,
        direccion,
        localidad,
        email,
        fecha_nacimiento,
        telefono
      );
      personaId = nuevaPersona.id;
    } else {
      personaId = persona.id;
    }
    await empleadoService.createEmpleado(personaId);
    res.redirect('/empleados?success=create'); // redirección con mensaje de creación
  } catch (error) {
    console.error(error);
    const { message } = error.errors ? error.errors[0].message : 'Error desconocido';
    res.render('empleados/agregar', { errores: message, empleado: req.body, req });
  }
});

router.put('/', async (req, res) => {
  let empleado = req.body;
  try {
    const persona = await personaService.getPersona(empleado.idPersona);
    await persona.update({
      ...empleado,
    });
    res.redirect('/empleados?success=edit'); // redirección con mensaje de edición
  } catch (error) {
    const { message } = error.errors[0];
    const empleadoDB = await empleadoService.getEmpleado(empleado.idEmpleado);
    res.render('empleados/editar', { errores: message, empleado: empleadoDB, req });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { id } = req.body;
    await empleadoService.deleteEmpleado(id);
    res.redirect('/empleados?success=delete');
  } catch (error) {
    console.error(error);
    res.redirect('/404');
  }
});


module.exports = router;
