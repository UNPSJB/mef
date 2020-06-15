const express = require('express');
const router = express.Router();
const permisos = require('../middlewares/permisos');
const dinoService = require('../services/dinosaurio');
const huesoService = require('../services/hueso');
const subclaseService = require('../services/subclase');

const { generatePagination } = require('../services/utils')
const paginate = require('../middlewares/paginate')

router.get('/', 
  permisos.permisoPara([
    permisos.ROLES.TALLER, 
    permisos.ROLES.COLECCION,
    permisos.ROLES.EXHIBICION]), 
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
  permisos.permisoPara([permisos.ROLES.COLECCION]),
  async (req, res) => {
    try {
      const subclases = await subclaseService.getAllSubclases()
      res.render('dinosaurios/agregar',{
        subclases,req
      })
    } catch (error) {
      console.log(error)
    }
  });
  
  router.get('/editar/:id', 
    permisos.permisoPara([permisos.ROLES.COLECCION]),
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
  permisos.permisoPara([permisos.ROLES.COLECCION]),
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
  permisos.permisoPara([permisos.ROLES.TALLER, permisos.ROLES.COLECCION]),
  async (req, res) => { 
    try {
      const { id } = req.params;
      const huesos = await huesoService.getHuesosDino(id)
      
      if(req.session.rol === permisos.ROLES.TALLER){
        res.render("huesos/hueso", {huesos, taller:true, req});
      }else{
        res.render("huesos/hueso", {huesos, req});
      }
    } catch (error) {
      console.log(error)
    }
});

router.get('/huesos/:id', 
  permisos.permisoPara([permisos.ROLES.TALLER,permisos.ROLES.COLECCION, permisos.ROLES.EXHIBICION]),
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
  permisos.permisoPara([permisos.ROLES.TALLER]), 
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
  permisos.permisoPara([permisos.ROLES.COLECCION]), 
  async (req, res) =>{ // esto llama a dino service
    const {nombre, alimentacion, periodo, descubrimiento, idsubclase} = req.body;
    const {cant_cervicales,cant_dorsales,cant_sacras,cant_caudales,cant_cos_cervicales,cant_cos_dorsales,cant_hemales,cant_metacarpianos,cant_metatarsos,cant_dedos_mano,cant_dedos_pata} = req.body;
    
    try {
      const dinosaurio = await dinoService.createDinosaurio(nombre, alimentacion, periodo, descubrimiento, idsubclase) // es una promesa
      await huesoService.createHuesos(dinosaurio.id, [cant_cervicales,cant_dorsales,cant_sacras,cant_caudales,cant_cos_cervicales,cant_cos_dorsales,cant_hemales,cant_metacarpianos,cant_metatarsos,cant_dedos_mano,cant_dedos_pata]);
      res.redirect('/dinosaurios')
    } catch (error) {
      const dino = req.body;
      const subclases = await subclaseService.getAllSubclases()
      res.render("dinosaurios/agregar",{errores:error,dino,subclases,req})
    }

});

router.put('/',
  permisos.permisoPara([permisos.ROLES.COLECCION]), 
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
  permisos.permisoPara([permisos.ROLES.COLECCION]),
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
