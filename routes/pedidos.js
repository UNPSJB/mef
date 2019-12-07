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
    async (req,res)=>{
        // https://flaviocopes.com/javascript-async-await-array-map/
        const pedidosPromesa = await pedidosService.getPedidos();
        const pedidosFunc = async () =>{
            return Promise.all(pedidosPromesa.map(async pedido=>{
                pedido.estadoActual = await pedido.estado;
                pedido.estadoInstance = pedido.estadoActual.constructor.name;
                return pedido;
            }))
        }
        const pedidos = await pedidosFunc();
        res.render('pedidos/lista', {pedidos});
});
router.get('/agregar', 
permisos.permisoPara([permisos.ROLES.EXHIBICION]),
(req,res)=>{
    dinoService.getDinosaurios().then((dinosaurios)=>{
        clienteService.getClientes().then(clientes=>{
            res.render('pedidos/agregar',{dinosaurios,clientes}) 
        })
    })
});

router.get('/:id/empleados/',async (req,res)=>{
    const {id} = req.params;
    const pedido = await pedidosService.getPedido({id});
    const trabajando = await pedido.getEmpleados({include:[models.Persona]});
    res.send(JSON.stringify(trabajando,null,4))
});

router.get('/detalle/:id', (req,res)=>{
    const { id } = req.params;
    pedidosService.getPedido().then(async pedido=>{
        const estados = await pedido.estados;
        res.render("pedidos/detalle", {id, estados});
    })
})
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
router.put('/:id',async (req,res)=>{
    const {id} = req.params;
    console.log(req.params);
    console.log(req.body);
    let pedido = await pedidosService.getPedido(id);
    
    res.redirect('/pedidos');
});

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