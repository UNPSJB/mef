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
    })
});

router.get('/agregar', (req,res,next) => {
    personaService.getPersonas()
    .then((personas)=>{
        empleadoService.getEmpleados()
        .then((empleados) => {
            res.render('empleados/agregar',{empleados});
        })
    });
});

router.get('/editar/:id',(req,res,next) => {
    const { id } = req.params;
//ver cuando id no existe
empleadoService.getEmpleado(id)
    .then((empleado) =>{
        res.render('empleados/editar', { empleado });
    })
})

router.get('/eliminar/:id', (req,res,next)=>{
    const {id} = req.params;
    empleadoService.getEmpleado(id)
    .then((empleado)=> { 
        res.render('empleados/eliminar', {empleado});
    })
  });
  
  router.post('/', (req,res,next) =>{
    const {identificacion, nombre, apellido,  direccion,  localidad, email,  fecha_nacimiento, telefono, tipo} = req.body;
    
    
   
    if(tipo == 'nuevo'){
        return empleadoService.createEmpleados(identificacion, nombre, apellido,  direccion,  localidad, email,  fecha_nacimiento, telefono)
        .then(()=>{ res.redirect('/empleados')});
    }
    
    if(tipo == 'existe'){empleados
        return empleadoService.createEmpleado(tipoempleado, personaid)
        .then(()=>{ res.redirect('/empleados')});
    }


  });
  

  router.put('/', (req,res,next)=>{
    personaService.updatePersona(req.body)
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