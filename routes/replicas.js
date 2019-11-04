const express = require('express')
const router = express.Router();
const dinoService = require('../services/dinosaurio');
const replicasService = require('../services/replicas');

router.get('/',  (req,res)=>{
    replicasService.getPedidos()
    .then((pedidos)=>{      
        res.render('replicacion/lista', {pedidos})
    })       
});

router.get('/pedidos/agregar', (req,res)=>{
    dinoService.getDinosaurios().then((dinosaurios)=>{
        res.render('replicacion/agregar',{dinosaurios})
    })
})

router.get('/pedidos/:accion/:id', (req,res)=>{
    const {accion , id} = req.params;
    try{
        res.render(`replicacion/${accion}`,{ accion , id });
    }catch(e){
        res.redirect('/404')
    }    
})
router.post('/pedidos/:accion/:id', (req,res)=>{
    const {accion , id} = req.params;
    replicasService.getPedido({id}).then(async (pedido)=>{
        try {
            const que_hacer = await pedido.hacer(accion,req.body);
            console.log(que_hacer);
        } catch (error) {
            console.log("replicas router sale mal\n\n");
        }
    })
    .then(accion=> res.redirect('/replicas'))
    .catch(e=> {
        res.redirect('/404')
    })    
})

router.post('/', (req,res)=>{
    const {tipo, dinosaurio, hueso, cliente, descripcion, monto,finoferta} = req.body;
    if(tipo === "Interno"){
        replicasService.solicitar(hueso).then(e=>res.redirect('/replicas'));
    }
    if(tipo === "Externo"){
        replicasService.presupuestar(hueso, cliente, descripcion, monto,finoferta).then(e=>res.redirect('/replicas'));
    }
});
module.exports = router;