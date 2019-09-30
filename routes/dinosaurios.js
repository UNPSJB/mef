const express = require('express');
const router = express.Router();
const dinoService = require('../services/dinosaurio');

router.get('/', (req, res, next) => {
  console.log(req.session.userId);
  dinoService.getDinosaurios()
    .then((results) => {
      res.render('dinosaurios/dinosaurio', {
        results
      });
    });
});

router.get('/agregar', (req,res,next) => {
  res.render('dinosaurios/agregar');
});

router.get('/editar',(req,res,next) => {
  //ver cuando id no existe
  dinoService.getDinosaurio(req.query.id)
    .then((dino) =>{
    res.render('dinosaurios/editar', { dino });
    })
    .catch((err)=>{  console.log(err)}); //@TODO mostrar dino sin editar o algo
})

router.get('/eliminar', (req,res,next)=>{
  dinoService.getDinosaurio(req.query.id)
  .then((dino)=> res.render('dinosaurios/eliminar', { dino }))
  .catch((err)=>{console.log(err)}) //@TODO hacer pagina de volver o algo
})

router.post('/', (req,res,next) =>{ // esto llama a dino service
    const {nombre, alimentacion, periodo, descubrimiento, idsubclase} = req.body;
    console.log(idsubclase);
    dinoService.createDinosaurio(nombre, alimentacion, periodo, descubrimiento, idsubclase) // es una promesa
      .then(() => res.redirect('/dinosaurios'));
});

router.put('/', (req,res,next)=>{
    dinoService.updateDinosaurio(req.body)
      .then(() => res.redirect('/dinosaurios'));
});

router.delete('/' , (req,res,next) =>{
  dinoService.deleteDinosaurio(req.body.id)
    .then(() => res.redirect('/dinosaurios'));
});

module.exports = router;
