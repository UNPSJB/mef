const express = require('express');
const router = express.Router();
const FosilService = require('../services/fosil')

let fosilService = new FosilService();

router.get('/', (req, res, next) => {
    let results = null;
    fosilService.getFosiles()
        .then((fosiles) => {
            results = fosiles.map((row) => {
                console.log(row);
                return row.dataValues;
            });
            console.log(results);
            res.render('fosil', {
                results
            });
        });
});
router.get('/agregarFosil', (req, res, next) => {
    res.render('agregarFosil'); 
});
router.post('/', (req, res, next)=>{
    fosilService.createFosil(req.body)
    .then(()=>{
        res.redirect('/fosiles');
    })
});

module.exports = router;

