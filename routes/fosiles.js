const express = require("express");
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

router.get("/", (req, res, next) => {
  fosilService.getFosiles().then(results => {
    res.render("fosiles/fosil", {
      results
    });
  });
});

router.get("/agregarFosil", (req, res, next) => {
  dinoService.getDinosaurios().then(results => {
    res.render("fosiles/agregarFosil", { results, bones });
  });
});

router.get("/huesos/:id/agregar", (req, res, next) => {
  huesoService
    .getHueso(req.params.id)
    .then(hueso => {
      res.render("fosiles/agregar", { hueso });
    })
    .catch(er => {
      res.redirect("/dinosaurios");
    });
});

router.get("/editar", async (req, res, next) => {
  try {
    const fosil = await fosilService.getFosil(req.query.id);
    const hueso = await huesoService.getHueso(fosil.HuesoId);
    console.log(hueso)
    res.render("fosiles/editar", { fosil , hueso });
  } catch (error) {
    console.log(err);
  }
});

router.get("/eliminar", (req, res, next) => {
  fosilService
    .getFosil(req.query.id)
    .then(fosil => res.render("fosiles/eliminar", { fosil }))
    .catch(err => {
      console.log(err);
    }); //@TODO hacer pagina de volver o algo
});

router.delete("/", (req, res, next) => {
  fosilService.deleteFosil(req.body.id).then(() => res.redirect("/fosiles"));
});

router.put("/", (req, res, next) => {
  fosilService.updateFosil(req.body).then(() => res.redirect("/fosiles"));
});

router.post("/", (req, res, next) => {
  const {
    dinosaurio,
    hueso,
    numero_coleccion,
    peso,
    disponible,
    fecha_encontrado,
    observacion
  } = req.body;
  dinoService.getDinosaurio(dinosaurio).then(dino => {
    huesoService.getHuesoDino(dino.id, hueso).then(bone => {
      fosilService
        .createFosil(
          numero_coleccion,
          peso,
          disponible,
          fecha_encontrado,
          observacion,
          bone.id
        )
        .then(() => {
          res.redirect("/fosiles");
        });
    });
  });
});

module.exports = router;
