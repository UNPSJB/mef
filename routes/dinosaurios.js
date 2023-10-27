const express = require('express');
const router = express.Router();
const permisos = require('../middlewares/permisos');
const dinoService = require('../services/dinosaurio');
const huesoService = require('../services/hueso');
const subclaseService = require('../services/subclase');

const { generatePagination } = require('../services/utils')
const paginate = require('../middlewares/paginate')

router.get('/',
  async (req, res) => {
    try {
      const dinosaurio = await dinoService.getAllDinosaurios()
      res.render('dinosaurios/dinosaurio', { dinosaurio, req })
    } catch (error) {
      res.redirect('/404')
    }
  })

router.get('/agregar',
  async (req, res) => {
    try {
      const subclases = await subclaseService.getAllSubclases()
      res.render('dinosaurios/agregar', { subclases, req })
    } catch (error) {
      res.render('dinosaurios/agregar', { subclases, req, errores: error })
    }
  });

router.get('/editar/:id',
  async (req, res) => {
    try {
      const dino = await dinoService.getDinosaurio(req.params.id);
      const subclases = await subclaseService.getAllSubclases()
      const { alimentacion, periodo } = dino
      const [cretacico, jurasico, triasico] = [periodo == 'Cretacico', periodo == 'Jurasico', periodo == 'Triasico']
      const [carnivoro, herbivoro, omnivoro] = [alimentacion == 'Carnivoro', alimentacion == 'Herbivoro', alimentacion == 'Omnivoro']
      const subclaseFiltrada = subclases.filter(subClase => subClase.id != dino.SubClaseId)
      res.render('dinosaurios/editar', { dino, subclases: subclaseFiltrada, req, cretacico, jurasico, triasico, carnivoro, herbivoro, omnivoro });
    } catch (error) {
      console.log(error)
    }
  });



/** HUESOS  */

router.get('/moldes/:id',
  async (req, res) => {
    const { id } = req.params;
    const bones = ['Cráneo', 'Torax', 'Vertebral', 'Pelvis', 'Brazo', 'Manos', 'Piernas', 'Pies']
    // 'Cráneo'
    try {
      const dino = await dinoService.getDinosaurio(id)
      const huesos = await huesoService.getHuesosDino(id)
      const huesosAgrupados = await Promise.all(
        bones.map(async (bone) => {
          const agrupacionDeHuesos = await huesoService.getHuesosDinoArgs(id, { subtipohueso: bone })
          return agrupacionDeHuesos.map (huesos => {
            const hueso = { agrupado: bone, huesos }
            return hueso
          })
        })
      )
      res.render("huesos/hueso", { huesos, dino, huesosAgrupados, taller: true, req });

    } catch (error) {
      console.log(error)
    }
  });

  router.get('/huesos/:id',
  async (req, res) => {
    try {
      const { id } = req.params;
      const huesos = await huesoService.getHuesosDino(id);
      res.render('huesos/lista', { huesos, req }); // Renderiza una vista llamada 'lista' y pasa los huesos como datos
    } catch (error) {
      console.log(error);
      res.redirect('/404'); // Redirige a una página de error si ocurre algún problema
    }
  });


router.patch('/moldes/toggle',
  async (req, res) => { /// esto NO PUEDE SER ACCEDIDO por bones
    try {
      const { id } = req.query
      huesoService.toggleDisponibilidadHueso(id);
      res.send(200);
    } catch (error) {
      console.log(error)
    }
  });

router.post('/',
  async (req, res) => { // esto llama a dino service
    const { nombre, alimentacion, periodo, descubrimiento, idsubclase } = req.body;
    const { cant_cervicales, cant_dorsales, cant_sacras, cant_caudales, cant_cos_cervicales, cant_cos_dorsales, cant_hemales, cant_metacarpianos, cant_metatarsos, cant_dedos_mano, cant_dedos_pata } = req.body;

    try {
      const dinosaurio = await dinoService.createDinosaurio(nombre, alimentacion, periodo, descubrimiento, idsubclase) // es una promesa
      await huesoService.createHuesos(dinosaurio.id, [cant_cervicales, cant_dorsales, cant_sacras, cant_caudales, cant_cos_cervicales, cant_cos_dorsales, cant_hemales, cant_metacarpianos, cant_metatarsos, cant_dedos_mano, cant_dedos_pata]);
      res.redirect('/dinosaurios')
    } catch (error) {
      const dino = req.body;
      /** @TODO revisar */
      const { message } = error.errors[0]
      const subclases = await subclaseService.getAllSubclases()
      res.render("dinosaurios/agregar", { errores: message, dino, subclases, req })
    }

  });

router.put('/',
  async (req, res) => {
    try {
      const dino = await dinoService.updateDinosaurio(req.body)
      res.redirect('/dinosaurios')
    } catch (error) {
      console.log(error)
      const dino = req.body;
      const { message } = error.errors[0]
      const subclases = await subclaseService.getAllSubclases()
      res.render("dinosaurios/editar", { errores: message, dino, subclases, req })
    }
  });



module.exports = router;
