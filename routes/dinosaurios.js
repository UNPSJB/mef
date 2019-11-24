const express = require('express');
const router = express.Router();
const permisos = require('../auth/permisos');
const dinoService = require('../services/dinosaurio');
const huesoService = require('../services/hueso');
const subclaseService = require('../services/subclase');

router.get('/', 
  permisos.permisoPara(
    [permisos.ROLES.TALLER, 
    permisos.ROLES.COLECCION,
    permisos.ROLES.EXHIBICION]), (req, res, next) => {/// TALLER accede aca
  dinoService.getDinosaurios()
    .then((results) => {
      res.render('dinosaurios/dinosaurio', {
        results
      });
    });
});

router.get('/agregar',
permisos.permisoPara([permisos.ROLES.COLECCION]),
(req,res,next) => {
  subclaseService.getSubclases()
  .then((subclases)=>{
    res.render('dinosaurios/agregar',{
      subclases
    })
  });
});

router.get('/editar', async (req,res,next) => {
  //ver cuando id no existe
  const dino = await dinoService.getDinosaurio(req.query.id);
  subclaseService.getSubclases()
  .then((subclases)=>{
    res.render('dinosaurios/editar', { dino, subclases });    
  }); //@TODO mostrar dino sin editar o algo
});

router.get('/eliminar', (req,res,next)=>{
  dinoService.getDinosaurio(req.query.id)
  .then((dino)=> {
    res.render('dinosaurios/eliminar', { dino })
  })
  .catch((err)=>{console.log(err)}) //@TODO hacer pagina de volver o algo
});

// HUESOS
router.get('/moldes', (req, res) => { /// TALLER
  const { id } = req.query;
  huesoService.getHuesosDino(id)
    .then((huesos)=>{
      res.render("huesos/hueso",{huesos, jefeexhibicion:true});
    });
});

router.get('/huesos/:id', (req,res)=>{
  const {id} = req.params;
  huesoService.getHuesosDino(id)
    .then((huesos)=>{
      res.send(JSON.stringify(huesos,null,4))
    })
})

router.patch('/moldes/toggle',permisos.permisoPara([permisos.ROLES.TALLER]), (req,res)=>{ /// esto NO PUEDE SER ACCEDIDO por bones
  const { id } = req.query
  huesoService.toggleDisponibilidadHueso(id);
  res.send(200);
});

router.post('/',permisos.permisoPara([permisos.ROLES.COLECCION]), (req,res,next) =>{ // esto llama a dino service
  const {nombre, alimentacion, periodo, descubrimiento, idsubclase} = req.body;
  const {cant_cervicales,cant_dorsales,cant_sacras,cant_caudales,cant_cos_cervicales,cant_cos_dorsales,cant_hemales,cant_metacarpianos,cant_metatarsos,cant_dedos_mano,cant_dedos_pata} = req.body;
  dinoService.createDinosaurio(nombre, alimentacion, periodo, descubrimiento, idsubclase) // es una promesa
    .then((dinosaurio) => {
      // createHueso(nombre, numero, DinosaurioId){
      huesoService.createHuesos(dinosaurio.id, [cant_cervicales,cant_dorsales,cant_sacras,cant_caudales,cant_cos_cervicales,cant_cos_dorsales,cant_hemales,cant_metacarpianos,cant_metatarsos,cant_dedos_mano,cant_dedos_pata]);
      res.redirect('/dinosaurios'); //@TODO agregar mas experiencia
    })
    .catch((errores)=>{
      const dino = req.body;
      subclaseService.getSubclases()
  .then((subclases)=>{
      res.render("dinosaurios/agregar",{errores,dino,subclases})
    })});
});

router.put('/',permisos.permisoPara([permisos.ROLES.COLECCION]), (req,res)=>{
    dinoService.updateDinosaurio(req.body)
      .then(() => res.redirect('/dinosaurios'))
      .catch((errores)=>{
        const dino = req.body;
        subclaseService.getSubclases()
  .then((subclases)=>{
        res.render("dinosaurios/editar",{errores,dino,subclases})
      })});
});

router.delete('/' ,permisos.permisoPara([permisos.ROLES.COLECCION]) ,(req,res) =>{
  dinoService.deleteDinosaurio(req.body.id)
    .then(() => res.redirect('/dinosaurios'));
});



module.exports = router;
