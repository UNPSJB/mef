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

router.get('/editar',(req,res,next) => {
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
            return clienteService.createCliente(tipoCliente,identificacion ,nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono)
            .then(()=>{ res.redirect('/clientes')});
    }

    if(tipo == 'existe'){
        return clienteService.createClienteExiste(tipoCliente, personaid)
        .then(()=>{ res.redirect('/clientes')});
    }
  });

  router.put('/', (req,res,next)=>{
    console.log(req.body)
    clienteService.updateCliente(req.body)
    .then(() =>{
        console.log("cliente editado")
        res.redirect('/clientes');
        
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