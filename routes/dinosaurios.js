const express = require('express');
const router = express.Router();
const dinoService = require('../services/dinosaurio');

router.get('/', (req, res, next) => {
  dinoService.getDinosaurios()
    .then((results) => {
      res.render('dinosaurio', {
        results
      });
    });
});

router.get('/agregarDino', (req,res,next) => {
  res.render('agregarDino');
});

router.get('/editarDino',(req,res,next) => {
  //ver cuando id no existe
  dinoService.getDinosaurio(req.query.id)
    .then((dino) =>{
    res.render('editarDino', { dino });
    })
    .catch((err)=>{  console.log(err)}); //@TODO mostrar dino sin editar o algo
})

router.get('/eliminarDino', (req,res,next)=>{
  dinoService.getDinosaurio(req.query.id)
  .then((dino)=> res.render('eliminarDino', { dino }))
  .catch((err)=>{console.log(err)}) //@TODO hacer pagina de volver o algo
})

router.post('/', (req,res,next) =>{ // esto llama a dino service
    const {nombre, alimentacion, periodo, descubrimiento} = req.body
    dinoService.createDinosaurio(nombre, alimentacion, periodo, descubrimiento) // es una promesa
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
