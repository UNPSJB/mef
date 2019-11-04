const express = require('express');
const router = express.Router();
const empleadoService = require('../services/empleado.js');
const personaService = require('../services/persona.js');


//lista todos los empleados
router.get('/',(req, res, next) => {
    empleadoService.getEmpleados().then((results)=>{
        res.render('empleados/empleado',{
            results
        });
    });
});

router.get('/agregar', (req,res,next) => {
    personaService.getPersonas()
    .then((personas)=>{
        empleadoService.getEmpleados()
        .then((empleados) => {
            
            /*var resultados = personas.filter( function(persona){
                empleado.forEach(empleado => {
                    empleado.persona.id == persona.id;
                });
            });*/
            
            res.render('empleados/agregar',{empleados});
        })
    });
    
});

router.get('/editar',(req,res,next) => {
//ver cuando id no existe
empleadoService.getEmpleado(req.query.id)
    .then((empleado) =>{
        res.render('empleados/editar', { empleado });
    })
    .catch((err)=>{  console.log(err)}); //@TODO mostrar dino sin editar o algo
})

router.get('/eliminar', (req,res,next)=>{
    const {id} = req.query;
    empleadoService.getEmpleado(id)
    .then((empleado)=> { 
        res.render('empleados/eliminar', {empleado});
    })
  });
  
  router.post('/', (req,res,next) =>{
    const {documento, nombre, apellido,  direccion,  ciudad, email,  fecha_nacimiento, telefono, tipo} = req.body;
    
   
    if(tipo == 'nuevo'){
        empleadoService.createEmpleado(documento, nombre, apellido,  direccion,  ciudad, email,  fecha_nacimiento, telefono)
        .then(()=>{ res.redirect('/empleados')});
    }
    
    if(tipo == 'existe'){
        empleadoService.createEmpleado(tipoempleado, personaid)
        .then(()=>{ res.redirect('/empleado')});
    }
  });
  

  router.put('/', (req,res,next)=>{
    empleadoService.updateEmpleado(req.body)
    .then(() => res.redirect('/empleados'));
  });
  
  router.delete('/' , (req,res,next) =>{
    const {id} = req.body;
    empleadoService.deleteEmpleado(id)
    .then(() => {
        res.redirect('/empleados')
    });
  });

module.exports = router;