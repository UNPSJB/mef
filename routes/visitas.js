const express = require('express');
const router = express.Router();
const visitaService = require('../services/visita');
const exhibicionService = require('../services/exhibicion');
const clienteService = require('../services/cliente');
const guiaService = require('../services/guia');

/*----------------------------------------------------------------------------------- */
// Ruta protegida que lista las visitas
router.get('/', async (req, res) => {
  const { success } = req.query;
  try {
    const visitas = await visitaService.getAllVisitas(
      {},
      {
        raw: true,
        nest: true,
      }
    );
    let mensajeCreate;
    let mensajeEdit;
    if (success === 'create') {
      mensajeCreate = 'Visita agregada con éxito.';
    }
    if (success === 'edit') {
      mensajeEdit = 'Visita editada con éxito.';
    }
    if (success === 'cancelled') {
      mensajeEdit = 'Visita cancelada con éxito.';
    }
    if (success === 'finished') {
      mensajeEdit = 'Visita finalizada con éxito.';
    }
    res.render('visitas/visita', {
      results: visitas,
      req,
      success: mensajeCreate || mensajeEdit, // enviar el mensaje adecuado
    });
  } catch (error) {
    console.log(error);
  }
});
router.get('/list', async (req, res) => {
  try {
    const total = await visitaService.countVisitas();
    const { start, length, draw, search, order, columns } = req.query;
    const { visitas, recordsFiltered } = await visitaService.getVisitasDataTable({
      start,
      length,
      search,
      order,
      columns,
    });
    res.json({ draw, data: visitas, recordsTotal: total, recordsFiltered: recordsFiltered });
  } catch (error) {
    res.redirect('/404');
  }
});
router.get('/agregar', async (req, res) => {
  const exhibiciones = await exhibicionService.getAllExhibiciones({}, { raw: true, nest: true });
  const clientes = await clienteService.getAllClientes({}, { raw: true, nest: true });
  const guias = await guiaService.getAllGuias();
  res.render('visitas/agregar', { exhibiciones, clientes, guias, req });
});
router.get('/validar', async (req, res) => {
  const { fecha } = req.query;
  if (!fecha) {
    return res.status(400).send('Fecha no proporcionada');
  }
  try {
    const horariosDisponibles = await visitaService.verificarVisitas(fecha);
    res.json(horariosDisponibles);
  } catch (error) {
    console.error('Error al validar horarios:', error);
    res.status(500).send('Error al validar horarios');
  }
});
router.get('/editar/:id', async (req, res) => {
  const { id } = req.params;
  const exhibiciones = await exhibicionService.getAllExhibiciones({}, { raw: true, nest: true });
  const clientes = await clienteService.getAllClientes({}, { raw: true, nest: true });
  const guias = await guiaService.getAllGuias();
  const visita = await visitaService.getVisita(id, { raw: true, nest: true });
  const horariosDisponibles = await visitaService.verificarVisitas(visita.fechaVisita);
  res.render('visitas/editar', { visita, exhibiciones, clientes, guias, req, horariosDisponibles });
});

// Ruta para mostrar visitas para finalizar
router.get('/finalizar/:id', async (req, res) => {
  const { id } = req.params;
  const visita = await visitaService.getVisita(id, { raw: true, nest: true });

  res.render('visitas/finalizar', { visita, req });
});
router.get('/cancelar/:id', async (req, res) => {
  const { id } = req.params;
  const visita = await visitaService.getVisita(id, { raw: true, nest: true });
  console.log('visita', visita);
  res.render('visitas/cancelar', { visita, req });
});

router.get('/eliminar/:id', async (req, res) => {
  const { id } = req.params;
  const visita = await visitaService.getVisita(id, { raw: true, nest: true });
  res.render('visitas/eliminar', { visita, req });
});

router.get('/reportes', async (req, res) => {
  const { anio } = req.query;
  const anios = await visitaService.getAniosVisitas();
  const { totalVisitas, visitasFinalizadas } = await visitaService.getVisitasAnio(anio);

  res.render('visitas/reportes', { anios, totalVisitas, visitasFinalizadas, req });
});

router.get('/reportes/data', async (req, res) => {
  const { anio } = req.query;
  const { totalVisitas, visitasFinalizadas } = await visitaService.getVisitasAnio(anio);
  return res.json({
    totalVisitas,
    visitasFinalizadas,
  });
});

router.get('/reportes-por-edades', async (req, res) => {
  const anios = await visitaService.getAniosVisitas();
  const edadesVisitas = await visitaService.getEdadesVisitas();
  return res.render('visitas/reportes-edades', { anios, req, edadesVisitas });
});

router.get('/reportes-por-edades/data', async (req, res) => {
  const { anio } = req.query;
  const edadesVisitas = await visitaService.getEdadesVisitas(anio);
  return res.json({
    edadesVisitas,
  });
});

router.post('/cancelar/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await visitaService.cancelarVisita(id);
    res.redirect('/visitas?success=cancelled');
  } catch (error) {
    res.redirect('/404');
  }
});
router.post('/finalizar/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await visitaService.finalizarVisita(id);
    res.redirect('/visitas?success=finished');
  } catch (error) {
    res.redirect('/404');
  }
});

router.post('/', async (req, res) => {
  const { exhibicionId, clienteId, guiaId, cantidadPersonas, fecha, horario, precio, estado, observacion } = req.body;
  /** @TODO agregar try catch y la vista de agregar visita */
  try {
    await visitaService.createVisita(
      exhibicionId,
      clienteId,
      guiaId,
      cantidadPersonas,
      fecha,
      horario,
      precio,
      estado,
      observacion
    );
    res.redirect('/visitas?success=create'); // redirección con mensaje de creación
  } catch (error) {
    res.render('visitas/agregar', { req });
  }
});

router.put('/', async (req, res) => {
  const { id, exhibicionId, clienteId, guiaId, cantidadPersonas, fecha, horario, precio, estado, observacion } =
    req.body;
  /** agregar async await, try catch, render con visitas, request, error */
  return visitaService
    .updateVisita(id, exhibicionId, clienteId, guiaId, cantidadPersonas, fecha, horario, precio, estado, observacion)
    .then(visita => {
      res.redirect('/visitas?success=edit'); // redirección con mensaje de edición
    });
});

module.exports = router;
