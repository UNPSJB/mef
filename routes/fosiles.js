const express = require("express");
const router = express.Router();
const fosilService = require("../services/fosil");
const huesoService = require("../services/hueso");

router.get("/", (req, res, next) => {
  fosilService.getFosiles().then(results => {
    res.render("fosiles/fosil", {
      results
    });
  });
});

router.get("/agregarFosil", (req, res, next) => {
  res.render("fosiles/agregarFosil");
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
    res.render("fosiles/editar", { fosil });
  } catch (error) {
    console.log(err);
  }
});

router.get("/eliminar", (req, res, next) => {
  fosilService
    .getFosil(req.query.id)
    .then(fosil => res.render("fosiles/eliminar", { fosil }))
    .catch(err => {
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
    numero_coleccion,
    peso,
    disponible,
    fecha_encontrado,
    observacion,
    HuesoId
  } = req.body;
  fosilService
    .createFosil(
      numero_coleccion,
      peso,
      disponible,
      fecha_encontrado,
      observacion,
      HuesoId
    )
    .then(() => {
      res.redirect("/fosiles");
    });
});

module.exports = router;
