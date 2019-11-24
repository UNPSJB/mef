const express = require("express");
const permisos = require('../auth/permisos');
const router = express.Router();

// Servicios requeridos
const dinoService = require("../services/dinosaurio");
const fosilService = require("../services/fosil");
const huesoService = require("../services/hueso");
const bones = [
  "Craneo",
  "Mandibula",
  "Paladar",
  "Vertebras Cervicales",
  "Costillas Cervicales",
  "Vertebras Dorsales",
  "Costillas Dorsales",
  "Escapula",
  "Humero",
  "Radio",
  "Unla",
  "Manos",
  "Pies",
  "Pelvis",
  "Vertebras Sacras",
  "Vertebras Caudales",
  "Hemales"
];

router.get("/", 
permisos.permisoPara([permisos.ROLES.COLECCION,permisos.ROLES.EXHIBICION]),
(req, res, next) => {
  fosilService.getFosiles().then(results => {
    res.render("fosiles/fosil", {
      results
    });
  });
});

router.get("/agregar", 
permisos.permisoPara([permisos.ROLES.COLECCION]),
(req, res, next) => {
  dinoService.getDinosaurios().then(results => {
    res.render("fosiles/agregar", { results, bones });
  });
});

router.get("/editar", 
permisos.permisoPara([permisos.ROLES.COLECCION]),
async (req, res, next) => {
  const fosil = await fosilService.getFosil(req.query.id);
  dinoService.getDinosaurios().then(results => {
    res.render("fosiles/editar", { results, bones , fosil});
  });
});

router.get("/eliminar", 
permisos.permisoPara([permisos.ROLES.COLECCION]),
(req, res, next) => {
  fosilService
    .getFosil(req.query.id)
    .then(fosil => res.render("fosiles/eliminar", { fosil }))
    .catch(err => {
    });
});

router.delete("/", 
permisos.permisoPara([permisos.ROLES.COLECCION]),
(req, res, next) => {
  fosilService.deleteFosil(req.body.id).then(() => res.redirect("/fosiles"));
});

router.put("/", 
permisos.permisoPara([permisos.ROLES.COLECCION]),
(req, res, next) => {
  fosilService.updateFosil(req.body).then(() => res.redirect("/fosiles"));
});

router.post("/", 
permisos.permisoPara([permisos.ROLES.COLECCION]),
(req, res, next) => {
  const {
    DinosaurioId,
    huesos,
    numero_coleccion,
    peso,
    disponible,
    fecha_encontrado,
    observacion
  } = req.body;
  dinoService.getDinosaurio(DinosaurioId).then(dino => {
    fosilService
      .createFosil(
        numero_coleccion,
        peso,
        disponible,
        fecha_encontrado,
        observacion,
        DinosaurioId,
        huesos
      )
      .then(() => {
        res.redirect("/fosiles");
      });
  });
});

module.exports = router;
