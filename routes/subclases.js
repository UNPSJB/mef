const express = require('express');
const router = express.Router();
const SubclaseService = require('../services/subclase.js')//definir

let subclaseService = new SubclaseService();

router.get('/', (req, res, next) => {
    let result = null;
    subclaseService.getSubclases().then((subclases)=>{
        result = subclases.map((row)=>{
            return row.dataValues;
        });
        console.log(subclases);
        res.render('subclase',{
            result
        });
    });
});

router.get('/agregarSubclase', (req,res,next) =>{ // esto llama solo a la vista
    
});

router.get('/editarSubclase',(req,res,next)=>{

});

router.get('/eliminarSubclase', (req,res,next)=>{

});

router.post('/', (req,res,next) =>{

});

router.put('/', (req,res,next)=>{

});

router.delete('/' , (req,res,next) =>{

});


module.exports = router;