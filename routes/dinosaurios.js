const express = require('express');
const router = express.Router();
const dinoService = require('../services/dinosaurio');
const huesoService = require('../services/hueso');

router.get('/', (req, res, next) => {
  dinoService.getDinosaurios()
    .then((results) => {
      res.render('dinosaurios/dinosaurio', {
        results,
        jefeexhibicion:true
      });
    });
});

router.get('/agregar', (req,res,next) => {
  res.render('dinosaurios/agregar',{
    jefeexhibicion:true});
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

// HUESOS

router.get('/huesos', (req,res,next) => {
  res.render('huesos/hueso',{
    jefeexhibicion:true});
});

router.post('/huesos', (req, res) => {
  let { 
    cervicales,
    dorsales,
    sacras,
    caudales,
    cos_cervicales,
    cos_dorsales,
    hemales,
    metacarpianos,
    metatarsos,
    dedos_mano,
    dedos_pata } = req.body;
  const huesos  = [
      "Vertebra Cervical",
      "Vertebra Dorsal",
      "Vertebra Sacra",
      "Vertebra Caudal",
      "Costilla Cervical izquierda",
      "Costilla Cervical derecha",
      "Costilla Dorsal izquierda",
      "Costilla Dorsal derecha",
      "Hemal",
      "Metacarpiano izquierdo",
      "Metacarpiano derecho",
      "Metatarso izquierdo",
      "Metatarso derecho",
      "Falange de mano izquierda",
      "Falange de mano derecha",
      "Falange de pie izquierda",
      "Falange de pie derecha"
  ];
  let hueso_loco = huesos.map((item)=>{
    if (item.startsWith("Vertebra")){
      return [ item, "Vertebra",'NO'];
    }
    if (item.startsWith("Costilla")){
      return [ item, "Tórax",'NO'];
    }
    if (item.startsWith("Metacarpiano")){
      return [ item, "Mano",'NO'];
    }
    if (item.startsWith("Metatarso")){
      return [ item, "Pie",'NO'];
    }
    if (item.startsWith("Falange de mano")){
      return [ item, "Mano",'NO'];
    }
    if (item.startsWith("Falange de pie")){
      return [ item, "Pie",'NO'];
    }
  });
  console.log(hueso_loco);
});

module.exports = router;
