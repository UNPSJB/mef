const express = require('express')
const router = express.Router();
const permisos = require('../auth/permisos');
const dinoService = require('../services/dinosaurio');
const replicasService = require('../services/replicas');
const huesoService = require('../services/hueso');
const empleadoService = require('../services/empleado');
const clienteService = require('../services/cliente');
const models = require('../models');

router.get('/',  
    permisos.permisoPara([permisos.ROLES.TALLER, permisos.ROLES.EXHIBICION]),
    (req,res)=>{
    replicasService.getPedidos().then((pedidos)=>{
        res.render('replicacion/lista', {pedidos})
    })       
});
router.get('/pedidos/agregar', 
permisos.permisoPara([permisos.ROLES.EXHIBICION]),
(req,res)=>{
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
        res.render("replicacion/detalle", {id, estados});
    })
})
router.get('/pedidos/:accion/:id', 
    permisos.permisosParaEstado(),
    (req,res)=>{
    const {accion , id} = req.params;
    try{
        replicasService.getPedido({id}).then(async pedido =>{
            const detalles = await pedido.getDetalles({include:[models.Pedido, models.Hueso]});
            const estado = await pedido.estado;
            res.render(`replicacion/${accion}`,{ accion, id, detalles, pedido, estado  });
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