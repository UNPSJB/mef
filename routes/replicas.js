const express = require('express')
const router = express.Router();
const dinoService = require('../services/dinosaurio');
const replicasService = require('../services/replicas');
const huesoService = require('../services/hueso');
const clienteService = require('../services/cliente');

router.get('/',  (req,res)=>{
    replicasService.getPedidos().then((pedidos)=>{      
        res.render('replicacion/lista', {pedidos})
    })       
});
router.get("/prohibido",(req,res)=>{
    res.render('replicacion/prohibido')
})
router.get('/pedidos/agregar', (req,res)=>{
    dinoService.getDinosaurios().then((dinosaurios)=>{
        clienteService.getClientes().then(clientes=>{
            res.render('replicacion/agregar',{dinosaurios,clientes})
        })
    })
})
router.get('/pedidos/detalle/:id', (req,res)=>{
    const { id } = req.params;
    replicasService.getPedido().then(async pedido=>{
        const estados = await pedido.estados;
        console.log(estados);
        res.render("replicacion/detalle", {id, estados});
    })
})
router.get('/pedidos/:accion/:id', (req,res)=>{
    const {accion , id} = req.params;
    try{
        res.render(`replicacion/${accion}`,{ accion , id });
    }catch(e){//@TODO que hacer
        res.redirect('/404')
    }    
})
router.post('/pedidos/:accion/:id', (req,res)=>{
    const {accion , id} = req.params;
    replicasService.getPedido({id}).then(async (pedido)=>{
        try {
            await pedido.hacer(accion,req.body);
        } catch (error) {
            /**
             * @TODO agregar una vista de que no se puede hacer
             */
            console.log("log error::::::",error);
        }
    })
    .then(()=> res.redirect('/replicas'))
    .catch(()=> {res.redirect('/404')})
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