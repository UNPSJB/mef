const express = require('express');
const router = express.Router();
const permisos = require('../middlewares/permisos');
const guiaService = require('../services/guia');
const personaService = require('../services/persona');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const paginate = require('../middlewares/paginate');
const { generatePagination } = require('../services/utils');

router.get('/',
  paginate,
  async (req, res) => {
    try {
      const guias = await guiaService.getAllGuias();
      res.render('guias/guia', { results: guias, req });
    } catch (error) {
      res.redirect('/404');
    }
  }
);

router.get('/agregar',
  async (req, res) => {
    try {
      const idiomas = await guiaService.getIdiomas({}, { raw: true, nest: true });
      res.render('guias/agregar', { req, idiomas });
    } catch (error) {
      res.redirect('/404');
    }
  }
);

router.get('/editar/:id',
  async (req, res) => {
    try {
      const guia = await guiaService.getGuia(req.params.id);
      const { dias_trabaja, horario_trabaja } = guia;
      const [normal, franquero] = [dias_trabaja === 'Normal', dias_trabaja === 'Franquero'];
      const [diurno, nocturno] = [horario_trabaja === 'Diurno', horario_trabaja === 'Nocturno'];

      const idiomasGuia = await guia.getIdiomas({ raw: true, nest: true });
      const IDidiomasGuia = idiomasGuia.map(item => item.id);
      const idioma = await guiaService.getIdiomas({
        id: { [Op.notIn]: IDidiomasGuia }
      }, { raw: true, nest: true });

      res.render('guias/editar', { normal, franquero, diurno, nocturno, guia: JSON.parse(JSON.stringify(guia)), req, idioma, idiomasGuia });
    } catch (error) {
      res.redirect('/404');
    }
  }
);

router.get('/eliminar/:id',
  async (req, res) => {
    try {
      const guia = await guiaService.getGuia(req.params.id, { raw: true, nest: true });
      res.render('guias/eliminar', { guia, req });
    } catch (error) {
      res.redirect('/404');
    }
  }
);

router.post('/',
  async (req, res) => {
    const {
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
      altaLogica
    } = req.body;

    try {
      let persona = await personaService.getPersonaArgs({ where: { identificacion } });

      if (!persona) {
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
    } catch (error) {
      try {
        const persona = await personaService.getPersonaArgs({ where: { identificacion } });
        await guiaService.createGuia(
          dias_trabaja,
          new Date(),
          horario_trabaja,
          idiomas,
          persona.id
        );

        res.redirect('/guias');
      } catch (error) {
        const { message, value } = error.errors[0];
        if (altaLogica === "on") {
          const [guia] = await guiaService.getGuias(undefined, undefined, { PersonaId: value });
          await guia.restore();
          return res.redirect('/guias');
        }

        let mostrarAltaLogica = false;
        if (message === "Un Guía con este DNI ya se encontraba registrado.") {
          mostrarAltaLogica = true;
        }

        res.render('guias/agregar', { errores: message, guia: req.body, req, mostrarAltaLogica });
      }
    }
  }
);

router.put('/',
  async (req, res) => {
    const {
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

      await guia.setIdiomas(idiomas);
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
      const { message } = error.errors[0];
      const guia = await guiaService.getGuia(idGuia);
      res.render('guias/editar', { errores: message, guia, req });
    }
  }
);

router.delete('/',
  async (req, res) => {
    const { id } = req.body;
    try {
      await guiaService.deleteGuia(id);
      res.redirect('/guias');
    } catch (error) {
      const guia = await guiaService.getGuia(id);
      res.render('guias/eliminar', { error, guia, req });
    }
  }
);

module.exports = router;