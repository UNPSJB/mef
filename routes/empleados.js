const express = require('express');
const router = express.Router();
const empleadoService = require('../services/empleado.js');
const personaService = require('../services/persona.js');

// Lista todos los empleados
router.get('/', async (req, res) => {
  try {
    const empleados = await empleadoService.getAllEmpleados();
    res.render('empleados/empleado', { results: empleados, req });
  } catch (error) {
    res.redirect('/404');
  }
});

router.get('/list', async (req, res) => {
  try {
    const total = await empleadoService.countEmpleados();
    const { start, length, draw, search, columns, order } = req.query;
    const empleados = await empleadoService.getEmpleadosDataTable({ start, length, search, columns, order });
    res.json({ draw, data: empleados, recordsTotal: total, recordsFiltered: total });
  } catch (error) {
    res.redirect('/404');
  }
});

router.get('/agregar', (req, res) => {
  res.render('empleados/agregar', { req });
});

router.get('/editar/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const empleado = await empleadoService.getEmpleado(id, { raw: true, nest: true });
    res.render('empleados/editar', { empleado, req });
  } catch (error) {
    res.redirect('/404');
  }
});

router.get('/eliminar/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const empleado = await empleadoService.getEmpleado(id, { raw: true, nest: true });
    res.render('empleados/eliminar', { empleado, req });
  } catch (error) {
    res.redirect('/404');
  }
});

router.post('/', async (req, res) => {
  const { identificacion, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono, altaLogica } = req.body;
  try {
    let personaId;
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
    res.redirect('/empleados');
  } catch (error) {
    try {
      const persona = await personaService.getPersonaArgs({ identificacion });
      await empleadoService.createEmpleado(persona.id);
      res.redirect('/empleados');
    } catch (error) {
      const { message, value } = error.errors[0];
      if (altaLogica === "on") {
        const [empleado] = await empleadoService.getEmpleados(undefined, undefined, { PersonaId: value });
        await empleado.restore();
        return res.redirect('/empleados');
      }
      let mostrarAltaLogica = false;
      if (message === "Ya existe un Empleado con ese Documento.") {
        mostrarAltaLogica = true;
      }
      res.render('empleados/agregar', { errores: message, empleado: req.body, req, mostrarAltaLogica });
    }
  }
});

router.put('/', async (req, res) => {
  const { idPersona, idEmpleado, ...empleadoData } = req.body;
  try {
    const persona = await personaService.getPersona(idPersona);
    await persona.update(empleadoData);
    const empleadoDB = await empleadoService.getEmpleado(idEmpleado);
    await empleadoDB.update({ ...empleadoData });
    res.redirect('/empleados');
  } catch (error) {
    const { message } = error.errors[0];
    const empleadoDB = await empleadoService.getEmpleado(idEmpleado);
    res.render('empleados/editar', { errores: message, empleado: empleadoDB, req });
  }
});

router.delete('/', async (req, res) => {
  const { id } = req.body;
  try {
    await empleadoService.deleteEmpleado(id);
    res.redirect('/empleados');
  } catch (error) {
    res.redirect('/404');
  }
});

module.exports = router;