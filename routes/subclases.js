const express = require('express');
const router = express.Router();
const subclaseService = require('../services/subclase.js')


router.get('/',(req, res, next) => {
    subclaseService.getSubclases().then((result)=>{
        res.render('subclases/subclase',{
            result
        });
    });
});

router.get('/agregar', (req,res,next) =>{ // esto llama solo a la vista
      res.render('subclases/agregar');
});

router.get('/editar',(req,res,next)=>{
    const {id} = req.query;
    subclaseService.getSubclase(id)
    .then((subclase)=>{
        res.render('subclases/editar',{subclase});
    })
});

router.get('/eliminar', (req,res,next)=>{
    const {id} = req.query;
    subclaseService.getSubclase(id)
    .then((subclase)=>{
        res.render('subclases/eliminar',{subclase});    
    });
});

router.post('/', (req,res,next) =>{
    const {descripcion,clase} = req.body;
    subclaseService.createSubclase(descripcion,clase)
    .then((subclase)=>{
        res.redirect('/subclases')
    });
});

router.put('/', (req,res,next)=>{
    const subclase = req.body;
    subclaseService.updateSubclase(subclase)
    .then(()=> res.redirect('/subclases'));
});

router.delete('/' , (req,res,next) =>{
    const {id} = req.body;
    subclaseService.deleteSubclase(id)
    .then(()=>{
        res.redirect('/subclases');
    }); 
});


module.exports = router;