const express = require('express');
const router = express.Router();
const permisos = require('../middlewares/permisos');
const exhibicionService = require('../services/exhibicion');
const fosilService = require('../services/fosil');
const pedidoService = require('../services/pedidos');
const models = require('../models');
const { generatePagination } = require('../services/utils');
const paginate = require('../middlewares/paginate');

//lista todas las exhbiciones
router.get('/', async (req, res) => {
  const { success } = req.query;
  try {
    const exhibiciones = await exhibicionService.getAllExhibiciones(
      {},
      {
        raw: true,
        nest: true,
      }
    );
    let mensajeCreate;
    let mensajeEdit;
    let mensajeDelete;
    if (success === 'create') {
      mensajeCreate = 'Exhibición agregada con éxito.';
    }
    if (success === 'edit') {
      mensajeEdit = 'Exhibición editada con éxito.';
    }
    if (success === 'delete') {
      mensajeDelete = 'Exhibición eliminada con éxito.';
    }
    res.render('exhibiciones/exhibicion', {
      exhibiciones, //acá hay algún error que no me deja ver las exhibiciones
      req,
      success: mensajeCreate || mensajeEdit || mensajeDelete, // enviar el mensaje adecuado
    });
  } catch (error) {
    res.redirect('/404');
  }
});

router.get('/detalle/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const exhibicion = await exhibicionService.getExhibicion(id);
    const fosiles = await exhibicion.getFosils({ include: [models.Dinosaurio], raw: true, nest: true });
    const replicas = await exhibicion.getReplicas({
      include: [models.Hueso, models.Dinosaurio, models.Pedido],
      raw: true,
      nest: true,
    });
    console.log(replicas);
    /**@TODO esto tambien moverlo al service, aplica para otras cosas donde sea similar, usar mas objetos */
    res.render('exhibiciones/detalle', { exhibicion: exhibicion.dataValues, fosiles, replicas, req });
  } catch (error) {
    console.log(error);
    res.redirect('/404');
  }
});

router.get('/reportes', async (req, res) => {
  const { anio } = req.query;
  const pedidosDemorados = await pedidoService.getPedidosDemorados(anio);
  const anios = await pedidoService.buscarAniosPedidosDemorados();
  res.render('exhibiciones/reportes', {
    anios,
    pedidosDemorados,
    req,
  });
});
router.get('/reportes/data', async (req, res) => {
  const { anio } = req.query;
  const pedidosDemorados = await pedidoService.getPedidosDemorados(anio);
  return res.json(pedidosDemorados);
});
router.get('/agregar', async (req, res) => {
  try {
    const replicas = await pedidoService.getReplicas({ disponible: true });
    const fosiles = await fosilService.getAllFosiles({ disponible: true });
    res.render('exhibiciones/agregar', { replicas, fosiles, req });
  } catch (error) {
    res.redirect('/404');
  }
});

router.get('/editar/:id', async (req, res) => {
  const { id } = req.params;
  const replicas = await pedidoService.getReplicas({ disponible: true }, { raw: true, nest: true });
  const replicas_propias = await exhibicionService.getReplicas(id);
  const fosiles = await fosilService.getAllFosiles({ disponible: true });
  const fosiles_propios = await exhibicionService.getFosiles(id);
  const exhibicion = await exhibicionService.getExhibicion(id, { raw: true });
  res.render('exhibiciones/editar', { exh: exhibicion, req, fosiles, replicas, fosiles_propios, replicas_propias });
});

router.get('/eliminar/:id', async (req, res) => {
  const { id } = req.params;
  const exhibicion = await exhibicionService.getExhibicion(id, { raw: true });
  res.render('exhibiciones/eliminar', { exh: exhibicion, id, req });
});

router.post('/', async (req, res) => {
  const { nombre, tematica, duracion, fosiles, replicas } = req.body;

  try {
    const fosilesArray =
      fosiles && Array.isArray(fosiles) && fosiles.length
        ? fosiles
        : !Number.isNaN(Number(fosiles))
          ? [Number(fosiles)]
          : [];
    const replicasArray =
      replicas && Array.isArray(replicas) && replicas.length
        ? replicas
        : !Number.isNaN(Number(replicas))
          ? [Number(replicas)]
          : [];
    await exhibicionService.createExhibicion(nombre, tematica, duracion, fosilesArray, replicasArray);
    res.redirect('/exhibiciones?success=create'); // redirección con mensaje de edición
  } catch (error) {
    const { message } = error.errors[0];
    const replicas = await pedidoService.getReplicas({ disponible: true });
    const fosiles = await fosilService.getAllFosiles({ disponible: true });
    res.render('exhibiciones/agregar', { errores: message, nombre, tematica, replicas, fosiles, duracion, req });
  }
});

router.put('/', async (req, res) => {
  const { id, nombre, tematica, duracion, fosiles, replicas } = req.body;
  try {
    const fosilesArray =
      fosiles && Array.isArray(fosiles) && fosiles.length
        ? fosiles
        : !Number.isNaN(Number(fosiles))
          ? [Number(fosiles)]
          : [];
    const replicasArray =
      replicas && Array.isArray(replicas) && replicas.length
        ? replicas
        : !Number.isNaN(Number(replicas))
          ? [Number(replicas)]
          : [];
    await exhibicionService.updateExhibicion(id, nombre, tematica, duracion, fosilesArray, replicasArray);
    res.redirect('/exhibiciones?success=edit'); // redirección con mensaje de edición
  } catch (error) {
    console.log(error);
    const { message } = error.errors[0];

    const exhibicion = await exhibicionService.getExhibicion(id);
    const replicas = await pedidoService.getReplicas({ disponible: true });
    const fosiles = await fosilService.getAllFosiles({ disponible: true });
    const replicas_propias = await exhibicionService.getReplicas(id);
    const fosiles_propios = await exhibicionService.getFosiles(id);

    res.render('exhibiciones/editar', {
      errores: message,
      exh: exhibicion,
      req,
      fosiles,
      replicas,
      fosiles_propios,
      replicas_propias,
    });
  }
});

router.delete('/', async (req, res) => {
  const { id } = req.body;
  try {
    await exhibicionService.deleteExhibicion(id);
    res.redirect('/exhibiciones?success=delete');
  } catch (errores) {
    res.render('exhibiciones/eliminar', errores);
  }
});

module.exports = router;
