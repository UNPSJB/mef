const express = require("express");
const router = express.Router();
const permisos = require("../auth/permisos");
const exhibicionService = require("../services/exhibicion");
const fosilService = require("../services/fosil");
const pedidoService = require("../services/pedidos");

router.get("/", (req, res) => {
  exhibicionService.getExhibiciones().then(exhibiciones => {
    res.render("exhibiciones/exhibicion", { exhibiciones });
  });
});

router.get("/agregar", async (req, res) => {
  const replicas = await pedidoService.getReplicas({ disponible: true });
  const fosiles = await fosilService.getFosiles({ disponible: true });
  res.render("exhibiciones/agregar", { replicas, fosiles,req });
});
router.get("/editar/:id", async (req, res) => {
  const { id } = req.params;
  const replicas = await pedidoService.getReplicas({ disponible: true });
  const fosiles = await fosilService.getFosiles({ disponible: true });
  exhibicionService.getExhibicion(id).then(exh => {
    /** @TODO poner los fosiles/replicas ya usados tildados */
    res.render("exhibiciones/editar", { exh,req, fosiles, replicas });
  });
});
router.get("/eliminar/:id", (req, res) => {
  const { id } = req.params;
  exhibicionService.getExhibicion(id).then(exh => {
    res.render("exhibiciones/eliminar", { exh, id,req });
  });
});

router.post("/", (req, res) => {
  const {nombre, tematica, duracion, fosiles, replicas} = req.body;
  exhibicionService.createExhibicion(nombre,tematica,duracion,fosiles,replicas)
  .then(exhibicion=>{
    res.redirect('/exhibiciones')
  })
  .catch(exhibicion=>{
    res.render('exhibiciones/agregar', {nombre, tematica, duracion,req})
  })
});
router.put("/", async (req,res)=>{
  const {id, nombre, tematica, duracion, fosiles, replicas} = req.body;
  try {
    await exhibicionService.updateExhibicion(id, nombre, tematica, duracion)    
    res.redirect('/exhibiciones')
  } catch (error) {
    res.render('exhibiciones/editar')
  }
})

router.delete("/", async (req,res)=>{
  const { id } = req.body; 
  try {
    await exhibicionService.deleteExhibicion(id)
    /* @TODO poner en disponibles todas las exhibiciones */
    res.redirect('/exhibiciones');
  } catch (errores) {
    res.render('exhibiciones/eliminar', errores)
  }
})
module.exports = router;
