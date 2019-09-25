const express = require('express');
const router = express.Router();
const DinoService = require('../services/dinosaurio');

let dinoService = new DinoService();

router.get('/', (req, res, next) => {
  let results = null;
  dinoService.getDinosaurios()
    .then((dinosaurios) => {
      results = dinosaurios.map((row) => {
        return row.dataValues
      });
      res.render('dinosaurio', {
        results
      });
    });
});

router.get('/agregarDino', (req,res,next) =>{ // esto llama solo a la vista
  res.render('agregarDino');
});

router.get('/editarDino',(req,res,next)=>{
  //ver cuando id no existe
  let id = req.query.id;
  dinoService.getDinosaurio({ id })
  .then((dino) =>{
    res.render('editarDino', { dino });
  })
  .catch((err)=>{
    console.log(err)
  })
})

router.get('/eliminarDino', (req,res,next)=>{
  let id = req.query.id;
  dinoService.getDinosaurio({ id })
  .then((dino)=>{
    res.render('eliminarDino', { dino })
  })
  .catch((err)=>{
    console.log(err);
  })
})

router.post('/', (req,res,next) =>{ // esto llama a dino service
    dinoService.createDinosaurio(req.body) // es una promesa
      .then(() =>{  //una vez que creo el dino... hacemos
          res.redirect('/dinosaurios')      // despues de tres segundos, vuelve a home (un directorio arriba) @TODO cambiar
    });
});

router.put('/', (req,res,next)=>{
    dinoService.updateDinosaurio(req.body).then(()=>{
    res.redirect('dinosaurios')
  });
})

router.delete('/' , (req,res,next) =>{
  let id = req.body.id;
  dinoService.deleteDinosaurio({ id }).then(()=>{
    res.redirect('/dinosaurios')
  })
})

module.exports = router;
