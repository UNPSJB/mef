const express = require('express');
const permisos = require('../middlewares/permisos');
const router = express.Router();

const dinoService = require('../services/dinosaurio');
const fosilService = require('../services/fosil');

const bones = ['Cráneo', 'Torax', 'Vertebral', 'Pelvis', 'Brazo', 'Manos', 'Piernas', 'Pies'];
const { generatePagination } = require('../services/utils');
const paginate = require('../middlewares/paginate');

router.get('/', async (req, res) => {
  try {
    const fosiles = await fosilService.getAllFosiles();
    res.render('fosiles/fosil', { results: fosiles, req });
  } catch (error) {
    res.redirect('/404');
  }
}),
  router.get('/list', async (req, res) => {
    try {
      const total = await fosilService.countFosiles();
      const { start, length, draw, search, columns, order } = req.query;
      const { fosiles, recordsFiltered } = await fosilService.getFosilesDataTable({
        start,
        length,
        search,
        columns,
        order,
      });
      res.json({ draw, data: fosiles, recordsTotal: total, recordsFiltered: recordsFiltered });
    } catch (error) {
      res.redirect('/404');
    }
  });

router.get('/agregar', async (req, res) => {
  const results = await dinoService.getAllDinosaurios();
  res.render('fosiles/agregar', { results, bones, req });
});

router.get('/editar/:id', async (req, res) => {
  const { id } = req.params;
  const fosil = await fosilService.getFosil(id);
  const dinosaurios = await dinoService.getAllDinosaurios();
  const dinosaurio = fosil.Dinosaurio;
  const bonesFiltered = bones.filter(bone => bone !== fosil.huesos);
  res.render('fosiles/editar', { dinosaurio, dinosaurios, bones: bonesFiltered, fosil, req });
});

router.put('/', async (req, res) => {
  await fosilService.updateFosil(req.body);
  res.redirect('/fosiles');
});

router.post('/', async (req, res) => {
  const { DinosaurioId, huesos, numero_coleccion, peso, disponible, fecha_encontrado, observacion } = req.body;
  try {
    // createFosil(numero_coleccion, peso, disponible, fecha_encontrado, observacion, DinosaurioId, huesos) {
    const fosil = await fosilService.createFosil(
      numero_coleccion,
      peso,
      disponible,
      fecha_encontrado,
      observacion,
      DinosaurioId,
      huesos
    );
    res.redirect('/fosiles');
  } catch (error) {
    /** @TODO revisar */
    const { message } = error.errors[0];
    const results = await dinoService.getAllDinosaurios();
    res.render('fosiles/agregar', { results, dino: req.body, bones, req, errores: message });
  }
});

module.exports = router;
