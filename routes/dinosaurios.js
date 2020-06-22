const express = require('express');
const router = express.Router();
const permisos = require('../middlewares/permisos');
const dinoService = require('../services/dinosaurio');
const huesoService = require('../services/hueso');
const subclaseService = require('../services/subclase');

const { generatePagination } = require('../services/utils')
const paginate = require('../middlewares/paginate')

router.get('/', 
  paginate,
  async (req, res) => {
    const { page, limit } = req.query
    try {
      const dinosaurio = await dinoService.getDinosaurios(page, limit)
      const paginationObj = {
        ...generatePagination('dinosaurios', dinosaurio.count, page, limit)
      }
      res.render('dinosaurios/dinosaurio', { dinosaurio: dinosaurio.rows, paginationObj, req })
    } catch (error) {
      res.redirect('/404')
    }
  })
  
  router.get('/agregar',
  async (req, res) => {
    try {
      const subclases = await subclaseService.getAllSubclases()
      res.render('dinosaurios/agregar',{ subclases,req })
    } catch (error) {
      console.log(error)
      res.render('dinosaurios/agregar', { subclases, req, errores:error })
    }
  });
  
  router.get('/editar/:id', 
    async (req, res) => {
      try {
        const dino = await dinoService.getDinosaurio(req.params.id);
        const subclases = await subclaseService.getAllSubclases()
        res.render('dinosaurios/editar', { dino, subclases,req });    
      } catch (error) {
        console.log(error)
      }
});

router.get('/eliminar/:id', 
  async (req, res)=>{
    try {
      const dino = await dinoService.getDinosaurio(req.params.id)
      res.render('dinosaurios/eliminar', { dino,req })
    } catch (error) {
      console.log(error)      
    }
});

/** HUESOS  */

router.get('/moldes/:id', 
  async (req, res) => { 
    const { id } = req.params;
    const bones = ['Cráneo', 'Torax','Vertebral', 'Pelvis','Brazo','Manos','Piernas','Pies']
    // 'Cráneo'
    try {
      const dino = await dinoService.getDinosaurio(id)
      const huesos = await huesoService.getHuesosDino(id)
      const huesosAgrupados = await Promise.all(
        bones.map((bone) => {
          return huesoService.getHuesosDinoArgs( id, { subtipohueso:bone} ).then(huesos =>{
            const hueso =  { agrupado: bone, huesos }
            return hueso
          })
        })
      )
      res.render("huesos/hueso", {huesos, dino, huesosAgrupados, taller:true, req});

    } catch (error) {
      console.log(error)
    }
});

router.get('/huesos/:id', 
  async (req, res)=>{
    try {
      const {id} = req.params;
      const huesos = await huesoService.getHuesosDino(id)
      res.send(JSON.stringify(huesos, null, 4))
    } catch (error) {
      console.log(error)
    }
})

router.patch('/moldes/toggle',
  async (req, res)=>{ /// esto NO PUEDE SER ACCEDIDO por bones
    try {
      const { id } = req.query
      huesoService.toggleDisponibilidadHueso(id);
      res.send(200);
    } catch (error) {
      console.log(error)
    }
});

router.post('/',
  async (req, res) =>{ // esto llama a dino service
    const {nombre, alimentacion, periodo, descubrimiento, idsubclase} = req.body;
    const {cant_cervicales,cant_dorsales,cant_sacras,cant_caudales,cant_cos_cervicales,cant_cos_dorsales,cant_hemales,cant_metacarpianos,cant_metatarsos,cant_dedos_mano,cant_dedos_pata} = req.body;
    
    try {
      const dinosaurio = await dinoService.createDinosaurio(nombre, alimentacion, periodo, descubrimiento, idsubclase) // es una promesa
      await huesoService.createHuesos(dinosaurio.id, [cant_cervicales,cant_dorsales,cant_sacras,cant_caudales,cant_cos_cervicales,cant_cos_dorsales,cant_hemales,cant_metacarpianos,cant_metatarsos,cant_dedos_mano,cant_dedos_pata]);
      res.redirect('/dinosaurios')
    } catch (error) {
      const dino = req.body;
      const { message } = error.errors[0]
      const subclases = await subclaseService.getAllSubclases()
      res.render("dinosaurios/agregar",{errores:message,dino,subclases,req})
    }

});

router.put('/',
  async (req, res)=>{
    try {
      await dinoService.updateDinosaurio(req.body)
      res.redirect('/dinosaurios')     
    } catch (error) {
      const dino = req.body;
      const subclases = await subclaseService.getAllSubclases()
      res.render("dinosaurios/editar",{errores,dino,subclases,req})
    }
});

router.delete('/',
  async (req, res) =>{
    const { id } = req.body;
    try {
      await dinoService.deleteDinosaurio(id)           
    } catch (errores) {
      const dino = await dinoService.getDinosaurio(id);
      return res.render('dinosaurios/eliminar', {errores, dino, req})          
    } 
    return res.redirect('/dinosaurios')
});

module.exports = router;
