const express = require('express');
const router = express.Router();
const clienteService = require('../services/cliente.js');
const personaService = require('../services/persona.js');


//lista todos los clientes
router.get('/',(req, res, next) => {
    clienteService.getClientes().then((results)=>{
        res.render('clientes/cliente',{
            results
        });
    });
});

router.get('/agregar', (req,res,next) => {
    clienteService.getClientes()
    .then((clientes) => {
        res.render('clientes/agregar',{clientes});
    })
    .catch((err)=>{console.log(err)});
});

router.get('/editar',(req,res,next) => {
//ver cuando id no existe
clienteService.getCliente(req.query.id)
    .then((cliente) =>{
        res.render('clientes/editar', { cliente });
    })
    .catch((err)=>{  console.log(err)}); //@TODO mostrar dino sin editar o algo
})

router.get('/eliminar', (req,res,next)=>{
    const {id} = req.query;
    clienteService.getCliente(id)
    .then((cliente)=> { 
        res.render('clientes/eliminar', {cliente});
    })
  });
  
  router.post('/', (req,res,next) =>{
    const {identificacion ,nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono, tipo } = req.body;
    var expregCuil = /\d{2}-(\d|[a-zA-Z]){8}-\d{2}/;
    var expregDoc = /(\d|[a-zA-Z]){8}/;
    
    //Esto esta bien asqueroso necesito mejorar para trabajar las validaciones en otro lugar tal vez.
    if (expregCuil.test(identificacion) | expregDoc.test(identificacion)){//VALIDO QUE EL FORMATO DEL IDENTIFICADOR SEA ##-********-## o ********
        personaService.createPersona(   identificacion ,nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono)
        .then((persona)=>{
            clienteService.createCliente(tipo, persona.id) 
            .then(() => {
                res.redirect('/clientes');
            })
            .catch((err) => { 
            //error de cliente
            });
        }).catch((err) => { //error de persona
            console.log(err);
            res.render('clientes/agregar', {err});
        });

    }else{//ERROR FORMATO NO VALIDO
        var err = 'Identificador no cumple formato ##-********-## o ********';
        res.render('clientes/agregar', {err} );
    }

  });
  

  router.put('/', (req,res,next)=>{
    clienteService.updateCliente(req.body)
    .then(() => res.redirect('/clientes'));
  });
  
  router.delete('/' , (req,res,next) =>{
    const {id} = req.body;
    clienteService.deleteCliente(id)
    .then(() => {
        res.redirect('/clientes')
    });
  });

module.exports = router;