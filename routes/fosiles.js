const express = require("express");
const router = express.Router();
const fosilService = require("../services/fosil");

router.get('/', (req, res, next) => {
  fosilService.getFosiles().then(results => {
    res.render("fosiles/fosil", {
      results
    });
  });
});

router.get('/agregar', (req, res, next) => { 
  res.render("fosiles/agregar");
});

router.get('/editar', (req, res, next) => {
  fosilService
    .getFosil(req.body.id)
    .then(fosil => {
      res.render("fosiles/editar", { fosil });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/eliminar', (req, res, next) => {
  fosilService.getFosil(req.query.id)
    .then((fosil)=> res.render('fosiles/eliminar', { fosil }))
    .catch((err)=>{console.log(err)}) //@TODO hacer pagina de volver o algo      
});

router.delete('/' , (req,res,next) =>{
  fosilService.deleteFosil(req.body.id)
    .then(() => res.redirect('/fosiles'));
});

router.put('/', (req,res,next)=>{
  fosilService.updateFosil(req.body)
    .then(() => res.redirect('/fosiles'));
});

router.post('/', (req, res, next) => {
  const {
    numero_coleccion,
    peso,
    disponible,
    fecha_encontrado,
    observacion
  } = req.body;
  fosilService
    .createFosil(
      numero_coleccion,
      peso,
      disponible,
      fecha_encontrado,
      observacion
    )
    .then(() => {
      res.redirect("/fosiles");
    });
});

module.exports = router;
