const express = require('express');
const router = express.Router();
const clienteService = require('../services/cliente.js');
const personaService = require('../services/persona.js');

//lista todos los clientes
router.get('/',(req, res, next) => {
    clienteService.getClientes().then((results)=>{
        res.render('clientes/cliente',{
            results,req
        });
    });
});

router.get('/agregar', (req,res,next) => {
    res.render('clientes/agregar',{ req });
});

router.get('/editar/:id',(req,res,next) => {
const { id } = req.params;
clienteService.getCliente(id)
    .then((cliente) =>{
        res.render('clientes/editar', { cliente,req });
    })
})

router.get('/eliminar/:id', (req,res,next)=>{
    const { id } = req.params;
    clienteService.getCliente(id)
    .then((cliente)=> { 
        res.render('clientes/eliminar', {cliente,req});
    })
  });
  
router.post('/', async (req,res,next) =>{
    const {identificacion ,nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono, tipoCliente, PersonaId, tipo } = req.body;
    let errores = null;

    try {
        const persona = await personaService.createPersona(identificacion, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono)        
        const cliente = await clienteService.createClienteExiste(tipoCliente, persona.id)
    } catch (error) {
        try {
            const persona = await personaService.getPersonaArgs({identificacion});
            await clienteService.createClienteExiste(tipoCliente, persona.id)
        } catch (error) {
            errores = error;
        }
    }

    if(errores){
        res.render("clientes/agregar", {errores,req})
    }else{
        res.redirect('/clientes'); 
    }
});

  router.put('/', (req,res,next)=>{
    const {idPersona,identificacion ,nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono} = req.body;
    const {idCliente,tipoCliente} = req.body;
    var personaBody={
        "id":idPersona,
        "identificacion":identificacion,
        "nombre":nombre,
        "apellido":apellido,
        "direccion":direccion,
        "localidad":localidad,
        "email":email,
        "fecha_nacimiento":fecha_nacimiento,
        "telefono":telefono
    }
    var clienteBody={
        "id":idCliente,
        "tipo":tipoCliente
    }
    return clienteService.getCliente(idCliente)
    .then(()=>{
        clienteService.updateCliente(clienteBody)
        .then(()=>{
            personaService.getPersona(idPersona)
            .then(()=>{
                personaService.updatePersona(personaBody)
                .then(()=>{
                    res.redirect('/clientes');      
                })
            })
        })
    })
  });
  
  router.delete('/' , (req,res,next) =>{
    const {id} = req.body;
    clienteService.deleteCliente(id)
    .then(() => {
        res.redirect('/clientes')
    });
  });

module.exports = router;