const express = require('express');
const router = express.Router();
const permisos = require('../middlewares/permisos');
const guiaService = require('../services/guia');
const personaService = require('../services/persona');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const paginate = require('../middlewares/paginate')
const { generatePagination } = require('../services/utils');

router.get('/',
  paginate,
  async (req, res) => {
    try {
      const guias = await guiaService.getAllGuias()
      res.render('guias/guia', { results: guias, req })
    } catch (error) {
      res.redirect('/404')
    }
  }
);

router.get('/agregar',
  async (req, res) => {
    const idiomas = await guiaService.getIdiomas({}, { raw: true, nest: true });
    res.render('guias/agregar', { req, idiomas });
  }
);

router.get('/editar/:id',
  async (req, res) => {
    const guia = await guiaService.getGuia(req.params.id);

    const { dias_trabaja, horario_trabaja } = guia
    const [normal, franquero] = [dias_trabaja === 'Normal', dias_trabaja === 'Franquero']
    const [diurno, nocturno] = [horario_trabaja === 'Diurno', horario_trabaja === 'Nocturno']

    const idiomasGuia = await guia.getIdiomas({ raw: true, nest: true });

    const IDidiomasGuia = idiomasGuia.map(item => {
      return item.id;
    });
    const idioma = await guiaService.getIdiomas({
      id: { [Op.notIn]: [...IDidiomasGuia] }
    }, { raw: true, nest: true });
    res.render('guias/editar', { normal, franquero, diurno, nocturno, guia: JSON.parse(JSON.stringify(guia)), req, idioma, idiomasGuia });
  }
);

router.get('/eliminar/:id',
  async (req, res) => {
    const guia = await guiaService.getGuia(req.params.id, { raw: true, nest: true })
    res.render('guias/eliminar', { guia, req });
  }
);

/*
  Script en CLIENTE
    view Agregar
      click en nuevo o existente
*/
router.post(
  '/',
  async (req, res) => {
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
      telefono
    } = req.body;
    // IF NUEVO O EXITESTE
    var persona = null;
    try {
      persona = await personaService.getPersonaArgs({
        where: { identificacion }
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
    await guiaService.createGuia(
      dias_trabaja,
      new Date(),
      horario_trabaja,
      idiomas,
      persona.id
    );
    res.redirect('/guias');
  }
);

//actualizar la lista de idiomas por separado
router.put(
  '/',
  async (req, res) => {
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
      telefono
    } = req.body;

    try {
      await guiaService.updateGuia({
        id: idGuia,
        dias_trabaja,
        horario_trabaja
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
        telefono
      });
      res.redirect('/guias');
    } catch (error) {
      /** @todo agregar render con objeto guias, elecciones, request, error */
      console.log(error)
    }
  }
);

router.delete(
  '/',
  async (req, res) => {
    const { id } = req.body;
    try {
      await guiaService.deleteGuia(id);
      return res.redirect('/guias');
    } catch (error) {
      const guia = await guiaService.getGuia(id)
      res.render('guias/eliminar', { error, guia, req });
    }
  }
);

module.exports = router;
