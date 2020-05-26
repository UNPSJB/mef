const express = require("express");
const router = express.Router();
const permisos = require("../auth/permisos");
const guiaService = require("../services/guia.js");
const personaService = require("../services/persona.js");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

//lista todos los Guias
/*
  Ver como trae los idiomas del guia
*/
router.get(
  "/",
  permisos.permisoPara([permisos.ROLES.RRHH, permisos.ROLES.SECRETARIA]),
  async (req, res, ) => {
    let { page, size } = req.query
    if(!page || !size){
      page = 1
      size = 10
    }
    const results = await guiaService.getGuias(page, size)
    res.render("guias/guia", {results,req});
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
    const idiomasGuia = await guia.getIdiomas();
    const IDidiomasGuia = idiomasGuia.map(item => {
      return item.dataValues.id;
    });
    const idioma = await guiaService.getIdiomas({
      id: { [Op.notIn]: [...IDidiomasGuia] }
    });
    console.table(idiomasGuia);
    console.log(IDidiomasGuia);
    res.render("guias/editar", { guia, req, idioma, idiomasGuia });
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
router.put(
  "/",
  permisos.permisoPara([permisos.ROLES.RRHH]),
  async (req, res, next) => {
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

    await guiaService.updateGuia({
      id: idGuia,
      dias_trabaja,
      horario_trabaja
    });

    const guia = await guiaService.getGuia(idGuia);

    await guia.setIdiomas([  ...idiomas]);
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
    res.redirect("/guias");
  }
);

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
