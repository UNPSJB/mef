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
  (req, res, next) => {
    // Busca las personas que no son guias
    personaService.getPersonas().then(personas => {
      guiaService.getGuias().then(guias => {
        let noGuias = personas.filter(personaAux => {
          let noGuiaAux = true;
          guias.forEach(guiaAux => {
            if (personaAux.id == guiaAux.Persona.id) {
              noGuiaAux = false;
            }
          });
          return noGuiaAux;
        });

        res.render("guias/agregar", { noGuias, req });
      });
    });
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
  (req, res, next) => {
    const {
      // tipo: exitente o nuevo
      dias_trabaja,
      fecha_alta,
      horario_trabaja,
      idiomaId,
      personaid,
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
    guiaService
      .createGuia(
        dias_trabaja,
        fecha_alta,
        horario_trabaja,
        idiomaId,
        personaid,
        identificacion,
        nombre,
        apellido,
        direccion,
        localidad,
        email,
        fecha_nacimiento,
        telefono
      )
      .then(() => {
        res.redirect("/guias");
      })
      .catch(errores => {
        res.render("guias/agregar", { errores, req });
      });
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

/*
<<<<<<LUCAS>>>>>>> 

router.put("/", (req, res, next) => {
  const {
    idPersona,
    identificacion,
    nombre,
    apellido,
    direccion,
    localidad,
    email,
    fecha_nacimiento,
    telefono
  } = req.body;
  const { idGuia } = req.body;
  var personaBody = {
    id: idPersona,
    identificacion: identificacion,
    nombre: nombre,
    apellido: apellido,
    direccion: direccion,
    localidad: localidad,
    email: email,
    fecha_nacimiento: fecha_nacimiento,
    telefono: telefono
  };
  var guiaBody = {
    id: idguia
  };

  return guiaService.getGuia(idGuia).then(() => {
    guiaService.updateGuia(guiaBody).then(() => {
      personaService.getPersona(idPersona).then(() => {
        personaService.updatePersona(personaBody).then(() => {
          res.redirect("/guias");
        });
      });
    });
  });
});
*/

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
