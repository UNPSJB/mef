const express = require('express');
const router = express.Router();
const permisos = require('../middlewares/permisos');
const guiaService = require('../services/guia');
const personaService = require('../services/persona');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const paginate = require('../middlewares/paginate');
const { generatePagination } = require('../services/utils');

//lista a todos los guias
router.get('/', paginate, async (req, res) => {
  const { success } = req.query;
  try {
    const guias = await guiaService.getAllGuias(
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
      mensajeCreate = 'Guía agregado con éxito.';
    }
    if (success === 'edit') {
      mensajeEdit = 'Guía editado con éxito.';
    }
    if (success === 'delete') {
      mensajeDelete = 'Guía eliminado con éxito.';
    };
    res.render('guias/guia', {
      results: guias,
      req,
      success: mensajeCreate || mensajeEdit || mensajeDelete, // enviar el mensaje adecuado
    });
  } catch (error) {
    res.redirect('/404');
  }
});
router.get('/list', async (req, res) => {
  try {
    const total = await guiaService.countGuias();

    const { start, length, draw, search, columns, order } = req.query;
    const guiasData = await guiaService.getGuiasDataTable({ start, length, search, columns, order });

    const rows = guiasData[1].rows; // Extrae solo la parte de "rows" de la respuesta

    let cantdadGuiasFiltrados = 0; // Extrae solo la parte de "rows" de la respuesta
    if (guiasData.length && guiasData[1].rows.length && guiasData[1].rows[0].cantidad_guias) {
      cantdadGuiasFiltrados = guiasData[1].rows[0].cantidad_guias;
    }
    res.json({ draw, data: rows, recordsTotal: total, recordsFiltered: cantdadGuiasFiltrados });
  } catch (error) {
    console.error(error);
    res.redirect('/404');
  }
});

router.get('/agregar', async (req, res) => {
  const idiomas = await guiaService.getIdiomas({}, { raw: true, nest: true });
  res.render('guias/agregar', { req, idiomas });
});

router.get('/editar/:id', async (req, res) => {
  const guia = await guiaService.getGuia(req.params.id);

  const { dias_trabaja, horario_trabaja } = guia;
  const [normal, franquero] = [dias_trabaja === 'Normal', dias_trabaja === 'Franquero'];
  const [diurno, nocturno] = [horario_trabaja === 'Diurno', horario_trabaja === 'Nocturno'];

  const idiomasGuia = await guia.getIdiomas({ raw: true, nest: true });

  const IDidiomasGuia = idiomasGuia.map(item => {
    return item.id;
  });
  const idioma = await guiaService.getIdiomas(
    {
      id: { [Op.notIn]: [...IDidiomasGuia] },
    },
    { raw: true, nest: true }
  );
  res.render('guias/editar', {
    normal,
    franquero,
    diurno,
    nocturno,
    guia: JSON.parse(JSON.stringify(guia)),
    req,
    idioma,
    idiomasGuia,
  });
});

router.get('/eliminar/:id', async (req, res) => {
  const guia = await guiaService.getGuia(req.params.id, { raw: true, nest: true });
  res.render('guias/eliminar', { guia, req });
});

router.post('/', async (req, res) => {
  const {
    // tipo: exitente o nuevo
    dias_trabaja,
    horario_trabaja,
    idiomas,
    identificacion,
    nombre,
    apellido,
    direccion,
    localidad,
    email,
    fecha_nacimiento,
    telefono,
  } = req.body;
  // IF NUEVO O EXITESTE
  var persona = null;
  try {
    persona = await personaService.getPersonaArgs({
      where: { identificacion },
    });
  } catch (error) {
    /** @TODO agregar render de agregar guia */
    persona = await personaService.createPersona(
      identificacion,
      nombre,
      apellido,
      direccion,
      localidad,
      email,
      fecha_nacimiento,
      telefono
    );
  }
  await guiaService.createGuia(dias_trabaja, new Date(), horario_trabaja, idiomas, persona.id);
  res.redirect('/guias?success=create'); // redirección con mensaje de creación
});

//actualizar la lista de idiomas por separado
router.put('/', async (req, res) => {
  const {
    // tipo: exitente o nuevo
    idGuia,
    idPersona,
    dias_trabaja,
    horario_trabaja,
    idiomas,
    identificacion,
    nombre,
    apellido,
    direccion,
    localidad,
    email,
    fecha_nacimiento,
    telefono,
  } = req.body;

  try {
    await guiaService.updateGuia({
      id: idGuia,
      dias_trabaja,
      horario_trabaja,
    });

    const guia = await guiaService.getGuia(idGuia);

    await guia.setIdiomas([...idiomas]);
    await personaService.updatePersona({
      id: idPersona,
      identificacion,
      nombre,
      apellido,
      direccion,
      localidad,
      email,
      fecha_nacimiento,
      telefono,
    });
    res.redirect('/guias?success=edit'); // redirección con mensaje de edición
  } catch (error) {
    /** @todo agregar render con objeto guias, elecciones, request, error */
    console.log(error);
  }
});

router.delete('/', async (req, res) => {
  const { id } = req.body;
  try {
    await guiaService.deleteGuia(id);
    res.redirect('/guias?success=delete');
  } catch (error) {
    const guia = await guiaService.getGuia(id);
    res.render('guias/eliminar', { error, guia, req });
  }
});

module.exports = router;
