const express = require('express');
const router = express.Router();
const reportesVisitas = require('../services/reportesVisitas');

router.get('/', (req, res) => {
    const reportes = reportesVisitas.obtenerReportesSimulados();
    res.render('visitas/reportes', { reportes });
});

module.exports = router;