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
    personaService.getPersonas()
    .then((personas)=>{
        clienteService.getClientes()
        .then((clientes) => {
            personas = [
                {   id:12,
                    nombre:'oli'},
                {   id:13,
                    nombre:'we'},
                {   id:14,
                    nombre:'mundo'},
            ]

            cliente = [
                {id:12,
                nombre:'oli'}
            ]

            var resultados = personas.filter( function(persona){
                cliente.forEach(cliente => {
                    cliente.persona.id == persona.id;
                });
            });
            console.log(resultados);
            res.render('clientes/agregar',{clientes});
        })
    });
    
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
    const {identificacion ,nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono, tipoCliente, personaid, tipo } = req.body;
    if(tipo == 'nuevo'){
        clienteService.createCliente(tipoCliente,identificacion ,nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono)
        .then(()=>{ res.redirect('/redirect')});
    }

    if(tipo == 'existe'){
        clienteService.createCliente(tipoCliente, personaid)
        .then(()=>{ res.redirect('/redirect')});
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