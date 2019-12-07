const express = require('express');
const router = express.Router();
const permisos = require('../auth/permisos');
const dinoService = require('../services/dinosaurio');
const pedidosService = require('../services/pedidos');
const huesoService = require('../services/hueso');
const empleadoService = require('../services/empleado');
const clienteService = require('../services/cliente');
const models = require('../models');

router.get('/',  
    permisos.permisoPara([permisos.ROLES.TALLER, permisos.ROLES.EXHIBICION]),
    (req,res)=>{
    pedidosService.getPedidos().then((pedidos)=>{
        res.render('pedidos/lista', {pedidos})
    })       
});
router.get('/agregar', 
permisos.permisoPara([permisos.ROLES.EXHIBICION]),
(req,res)=>{
    dinoService.getDinosaurios().then((dinosaurios)=>{
        clienteService.getClientes().then(clientes=>{
            res.render('pedidos/agregar',{dinosaurios,clientes}) 
        })
    })
})

router.get('/detalle/:id', (req,res)=>{
    const { id } = req.params;
    pedidosService.getPedido({id}).then(async pedido=>{
        const estados = await pedido.estados;
        const detalles = await pedido.getDetalles({include:[models.Hueso]});
        
        const hueso = await huesoService.getHueso(detalles[0].HuesoId);
        const dinosaurio = hueso.Dinosaurio;
        console.log(dinosaurio);
        res.render("pedidos/detalle", {id, estados, pedido, dinosaurio});
  })
})
// models.Dinosaurio
router.get('/:accion/:id', 
    permisos.permisosParaEstado(),
    (req,res)=>{
    const {accion , id} = req.params;
    try{
        pedidosService.getPedido({id}).then(async pedido =>{
            const detalles = await pedido.getDetalles({include:[models.Pedido, models.Hueso]});
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