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
    dias_trabaja,
    horario_trabaja,
    idiomas = [], // Asegurarse de que 'idiomas' sea un array, incluso si no se seleccionan.
    identificacion,
    nombre,
    apellido,
    direccion,
    localidad,
    email,
    fecha_nacimiento,
    telefono,
    altaLogica
  } = req.body;
  try {
    let personaId;
    let persona = await personaService.getPersonaArgs({ identificacion });
    // Si la persona no existe, crearla
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
    // Crear el guía con la persona asociada
    await guiaService.createGuia(dias_trabaja, new Date(), horario_trabaja, idiomas, personaId);
    res.redirect('/guias?success=create');
  } catch (error) {
    console.error("Error al crear el guía:", error);
    try {
      const persona = await personaService.getPersonaArgs({ identificacion });
      const { message, value } = error.errors[0];
      if (altaLogica === "on") {
        const [guia] = await guiaService.getGuias(undefined, undefined, { PersonaId: value });
        await guia.restore();
        return res.redirect('/guias?success=create');
      }
    } catch (innerError) {
      console.error("Error al intentar restaurar el guía:", innerError);
    }
    // Manejo del error en la creación del guía, conservar datos de formulario e idiomas seleccionados
    const { message } = error.errors[0];
    // Obtener todos los idiomas disponibles
    const idiomasDisponibles = await guiaService.getIdiomas({}, { raw: true, nest: true });
    // Mapear los idiomas seleccionados para marcarlos como seleccionados en el checkbox
    const idiomasSeleccionados = idiomas.map(id => parseInt(id));
    let mostrarAltaLogica = false;
    if (message === "Un Guía con este DNI ya se encontraba registrado.") {
      mostrarAltaLogica = true;
    }
    // Renderizar nuevamente la vista con los datos del formulario y los idiomas seleccionados
    res.render('guias/agregar', {
      errores: message,
      guia: req.body, // Conservar los datos del formulario
      req,
      mostrarAltaLogica,
      idiomas: idiomasDisponibles.map(idioma => ({
        ...idioma,
        checked: idiomasSeleccionados.includes(idioma.id), // Marcar los idiomas previamente seleccionados
      }))
    });
  }
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