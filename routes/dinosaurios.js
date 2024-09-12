const express = require('express');
const router = express.Router();
const permisos = require('../middlewares/permisos');
const dinoService = require('../services/dinosaurio');
const huesoService = require('../services/hueso');
const subclaseService = require('../services/subclase');

const { generatePagination } = require('../services/utils');
const paginate = require('../middlewares/paginate');

router.get('/', async (req, res) => {
  try {
    const { success } = req.query; // Obtener el parámetro success
    const dinosaurio = await dinoService.getAllDinosaurios(
      {},
      {
        raw: true,
        nest: true,
      }
    );
    let mensajeCreate;

    // Asignar el mensaje adecuado basado en el valor de 'success'
    if (success === 'create') {
      mensajeCreate = 'Dinosaurio agregado con éxito.';
    }

    res.render('dinosaurios/dinosaurio', {
      dinosaurio,
      req,
      success: mensajeCreate,
    });
  } catch (error) {
    res.redirect('/404');
  }
});

router.get('/list', async (req, res) => {
  try {
    const total = await dinoService.countDinosaurios();
    const { start, length, draw, search, columns, order } = req.query;
    const { dinosaurios, recordsFiltered } = await dinoService.getDinosauriosDataTable({
      start,
      length,
      search,
      columns,
      order,
    });
    res.json({ draw, data: dinosaurios, recordsTotal: total, recordsFiltered: recordsFiltered });
  } catch (error) {
    res.redirect('/404');
  }
});

router.get('/agregar', async (req, res) => {
  try {
    const subclases = await subclaseService.getAllSubclases();
    res.render('dinosaurios/agregar', { subclases, req });
  } catch (error) {
    res.render('dinosaurios/agregar', { subclases, req, errores: error });
  }
});


/** HUESOS  */

router.get('/moldes/:id', async (req, res) => {
  const { id } = req.params;
  const bones = ['Cráneo', 'Torax', 'Vertebral', 'Pelvis', 'Brazo', 'Manos', 'Piernas', 'Pies'];
  // 'Cráneo'
  try {
    const dino = await dinoService.getDinosaurio(id);
    const huesos = await huesoService.getHuesosDino(id);
    const huesosAgrupados = await Promise.all(
      bones.map(async bone => {
        const agrupacionDeHuesos = await huesoService.getHuesosDinoArgs(id, { subtipohueso: bone });
        return agrupacionDeHuesos.map(huesos => {
          const hueso = { agrupado: bone, huesos };
          return hueso;
        });
      })
    );
    res.render('huesos/hueso', { huesos, dino, huesosAgrupados, taller: true, req });
  } catch (error) {
    console.log(error);
  }
});

router.get('/huesos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const huesos = await huesoService.getHuesosDino(id);
    res.send(huesos);
  } catch (error) {
    console.log(error);
  }
});

router.post('/', async (req, res) => {
  // esto llama a dino service
  const { nombre, alimentacion, periodo, descubrimiento, idsubclase } = req.body;
  const {
    cant_cervicales,
    cant_dorsales,
    cant_sacras,
    cant_caudales,
    cant_cos_cervicales,
    cant_cos_dorsales,
    cant_hemales,
    cant_metacarpianos,
    cant_metatarsos,
    cant_dedos_mano,
    cant_dedos_pata,
  } = req.body;

  try {
    const dinosaurio = await dinoService.createDinosaurio(nombre, alimentacion, periodo, descubrimiento, idsubclase); // es una promesa
    await huesoService.createHuesos(dinosaurio.id, [
      cant_cervicales,
      cant_dorsales,
      cant_sacras,
      cant_caudales,
      cant_cos_cervicales,
      cant_cos_dorsales,
      cant_hemales,
      cant_metacarpianos,
      cant_metatarsos,
      cant_dedos_mano,
      cant_dedos_pata,
    ]);
    res.redirect('/dinosaurios?success=create'); // redirección con mensaje de creación
  } catch (error) {
    const dino = req.body;
    /** @TODO revisar */
    const { message } = error.errors[0];
    const subclases = await subclaseService.getAllSubclases();
    res.render('dinosaurios/agregar', { errores: message, dino, subclases, req });
  }
});

router.put('/', async (req, res) => {
  try {
    const dino = await dinoService.updateDinosaurio(req.body);
    res.redirect('/dinosaurios');
  } catch (error) {
    console.log(error);
    const dino = req.body;
    const { message } = error.errors[0];
    const subclases = await subclaseService.getAllSubclases();
    res.render('dinosaurios/editar', { errores: message, dino, subclases, req });
  }
});

module.exports = router;
