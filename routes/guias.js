const express = require("express");
const router = express.Router();
const permisos = require("../auth/permisos");
const guiaService = require("../services/guia.js");
const personaService = require("../services/persona.js");

//lista todos los Guias
/*
  Ver como trae los idiomas del guia
*/
router.get(
  "/",
  permisos.permisoPara([permisos.ROLES.RRHH, permisos.ROLES.SECRETARIA]),
  (req, res, next) => {
    guiaService.getGuias().then(results => {
      console.table(results);
      res.render("guias/guia", {
        results,
        req
      });
    });
  }
);

router.get(
  "/agregar",
  permisos.permisoPara([permisos.ROLES.RRHH]),
  async (req, res, next) => {
    var idiomas = await guiaService.getIdiomas();
    res.render("guias/agregar", { req, idiomas });
  }
);

router.get(
  "/editar/:id",
  permisos.permisoPara([permisos.ROLES.RRHH]),
  async (req, res, next) => {
    const guia = await guiaService.getGuia(req.params.id);
    res.render("guias/editar", { guia, req });
  }
);

router.get(
  "/eliminar/:id",
  permisos.permisoPara([permisos.ROLES.RRHH]),
  (req, res, next) => {
    guiaService.getGuia(req.params.id).then(guia => {
      res.render("guias/eliminar", { guia, req });
    });
  }
);

/*
  Script en CLIENTE
    view Agregar
      click en nuevo o existente
*/
router.post(
  "/",
  permisos.permisoPara([permisos.ROLES.RRHH]),
  async (req, res, next) => {
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
    console.log(dias_trabaja);
    var persona = null;
    try {
      persona = await personaService.getPersonaArgs({
        where: { identificacion }
      });
    } catch (error) {
      console.log("ERROR PERSONA GUIA"); // Crear Persona
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
    res.redirect("/guias");
  }
);

//actualizar la lista de idiomas por separado
router.put("/", permisos.permisoPara([permisos.ROLES.RRHH]), (req, res) => {
  guiaService
    .updateGuia(req.body)
    .then(() => res.redirect("/guias"))
    .catch(errores => {
      const guia = req.body;
      res.render("guias/editar", { errores, guia, req });
    });
});

router.delete(
  "/",
  permisos.permisoPara([permisos.ROLES.RRHH]),
  async (req, res, next) => {
    const { id } = req.body;
    try {
      await guiaService.deleteGuia(id);
      return res.redirect("/guias");
    } catch (error) {
      guiaService.getGuia(id).then(guia => {
        res.render("guias/eliminar", { error, guia, req });
      });
    }
  }
);

module.exports = router;
