const express = require('express');
const router = express.Router();
const dinoService = require('../services/dinosaurio');
const pedidosService = require('../services/pedidos');
const huesoService = require('../services/hueso');
const empleadoService = require('../services/empleado');
const clienteService = require('../services/cliente');
const models = require('../models');

router.get('/',  (req,res)=>{
    pedidosService.getPedidos().then((pedidos)=>{
        res.render('pedidos/lista', {pedidos})
    })       
});
router.get("/prohibido",(req,res)=>{
    res.render('pedidos/prohibido')
})
router.get('/agregar', (req,res)=>{
    dinoService.getDinosaurios().then((dinosaurios)=>{
        clienteService.getClientes().then(clientes=>{
            res.render('pedidos/agregar',{dinosaurios,clientes}) 
        })
    })
})
router.get('/detalle/:id', (req,res)=>{
    const { id } = req.params;
    pedidosService.getPedido().then(async pedido=>{
        const estados = await pedido.estados;
        res.render("pedidos/detalle", {id, estados});
    })
})
router.get('/:accion/:id', (req,res)=>{
    /**
     * @TODO mostrar lista de detalles
     */
    const {accion , id} = req.params;
    try{
        pedidosService.getPedido({id}).then(async pedido =>{
            const detalles = await pedido.getDetalles({
                include:[models.Pedido, models.Hueso]
            });
            const estado = await pedido.estado;
            res.render(`pedidos/${accion}`,{ accion, id, detalles, pedido, estado  });
        })
    }catch(e){//@TODO que hacer
        res.redirect('/404')
    }    
})
router.get('/empleados', (req,res)=>{
    try{
        return empleadoService.getEmpleados()
        .then((empleados) => {
            res.send(JSON.stringify(empleados,null,4));
    })
    }catch(err){
        console.log(err);
    }
    
});

router.post('/:accion/:id', (req,res)=>{
    const {accion , id} = req.params;

    pedidosService.getPedido({id}).then(async (pedido)=>{
        try {
            await pedido.hacer(accion,req.body);
        } catch (error) {
            /**
             * @TODO agregar una vista de que no se puede hacer
             */
            console.log("log error::::::",error);
        }
    })
    .then(()=> res.redirect('/pedidos'))
    .catch(()=> {res.redirect('/404')})
})

router.post('/', (req,res)=>{
    const {tipo, dinosaurio, hueso, cliente, descripcion, monto,finoferta} = req.body;
    if(tipo === "Interno"){
        pedidosService.solicitar(hueso).then(e=>res.redirect('/pedidos'));
    }
    if(tipo === "Externo"){
        pedidosService.presupuestar(hueso, cliente, descripcion, monto,finoferta).then(e=>res.redirect('/pedidos'));
    }
});
module.exports = router;