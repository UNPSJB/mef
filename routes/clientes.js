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
    personaService.getPersonas().then((personas)=>{
        clienteService.getClientes().then((clientes)=>{
            let noClientes = personas.filter(person=>{
                let noCliente = true; 
                clientes.forEach(client=>{
                    if(person.id == client.Persona.id){
                        noCliente = false;
                    } 
                });
                return noCliente;
            });

            res.render('clientes/agregar',{ noClientes });
        }); 
    });
});

router.get('/editar/:id',(req,res,next) => {
const { id } = req.params;
clienteService.getCliente(id)
    .then((cliente) =>{
        res.render('clientes/editar', { cliente });
    })
})

router.get('/eliminar/:id', (req,res,next)=>{
    const { id } = req.params;
    clienteService.getCliente(id)
    .then((cliente)=> { 
        res.render('clientes/eliminar', {cliente});
    })
  });
  
  router.post('/', (req,res,next) =>{
    const {identificacion ,nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono, tipoCliente, PersonaId, tipo } = req.body;
    if(tipo === 'nuevo'){
        return clienteService.createCliente(tipoCliente,identificacion ,nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono)
        .then(()=>{ res.redirect('/clientes')})
        .catch(errores =>{
            res.render('clientes/agregar',{ errores });
        });      
    }   
    if(tipo === 'existe'){
        console.log("existe:::::::::")
        return clienteService.createClienteExiste(tipoCliente, PersonaId)
        .then(()=>{ res.redirect('/clientes')})
        .catch(errores =>{
            res.render('clientes/agregar',{ errores });
        });
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
    console.log(clienteBody);
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