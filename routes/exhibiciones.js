const express = require('express');
const router = express.Router();
const permisos = require('../auth/permisos');
const exhibicionService = require('../services/exhibicion');

router.get('/',(req,res)=>{
    exhibicionService.getExhibiciones().then(exhibiciones =>{
        res.render("exhibiciones/exhibicion",{exhibiciones});
    })
})

router.get('/agregar' , (req,res) =>{
    res.render("exhibiciones/agregar");
})

module.exports = router;