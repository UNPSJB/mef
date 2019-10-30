const express = require('express')
const router = express.Router();
const dinoService = require('../services/dinosaurio');
const huesoService = require('../services/dinosaurio');
const replicasService = require('../services/replicas');

router.get('/',  (req,res)=>{
    replicasService.getPedidos()
    .then((pedidos)=>{
        pedidos.map(async(pedido)=>{
            // estadoInstance  'Presupuestado'
            // se lo agregamos a cada pedido
            const nombreEstado = await pedido.estado;
            return pedido.estadoInstance = nombreEstado.constructor.name; 
        })
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
    switch(accion){
        case 'facturar':
            res.render("replicacion/facturar");
            break;
        case 'confirmar':
            res.render("replicacion/confirmar");
            break;
        case 'fabricar':
            res.render("replicacion/fabricar");
            break;
        case 'asignar':
            res.render("replicacion/asignar");
            break;
        case 'demorar':
            res.render("replicacion/demorar");
            break;
        case 'reanudar':
            res.render("replicacion/reanudar");
            break;
        case 'finalizar':
            res.render("replicacion/finalizar");
            break;
        case 'entregar':
            res.render("replicacion/entregar");
            break;
        default:
            res.redirect('/404')
    }
    
})
router.post('/pedidos/:accion/:id', (req,res)=>{
    const {accion , id} = req.params;
    switch(accion){
        case 'facturar':
            //@TODO facturar
            break;
        case 'confirmar':
            //@TODO confirmar
            break;
        case 'fabricar':
            //@TODO fabricar
            break;
        case 'asignar':
            //@TODO asignar
            break;
        case 'demorar':
            //@TODO demorar
            break;
        case 'reanudar':
            //@TODO reanudar
            break;
        case 'finalizar':
            //@TODO finalizar
            break;
        case 'entregar':
            //@TODO entregar
            break;
        default:
            res.redirect('/404')
    }
    
})


router.post('/', (req,res)=>{
    // console.log(req.body)
    const {tipo, dinosaurio, hueso, cliente, descripcion, monto,finoferta} = req.body;
    // if(tipo == "Interno")
        replicasService.createPedido(null, dinosaurio, hueso);
    // if(tipo == "Externo")
    //     replicasService.createPedido(tipo, dinosaurio, hueso, cliente, descripcion, monto,finoferta);
    res.redirect('/replicas');
});
module.exports = router;