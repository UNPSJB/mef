const express = require("express");
const router = express.Router();
const empleadoService = require("../services/empleado.js");
const personaService = require("../services/persona.js");

//lista todos los empleados
router.get("/", (req, res, next) => {
  empleadoService.getEmpleados().then(results => {
    res.render("empleados/empleado", {
      results,
      req
    });
  });
});

router.get("/agregar", (req, res) => {
  empleadoService.getEmpleados().then(empleados => {
    res.render("empleados/agregar", { empleados, req });
  });
});

router.get("/editar/:id", (req, res, next) => {
  const { id } = req.params;
  //ver cuando id no existe
  empleadoService.getEmpleado(id).then(empleado => {
    res.render("empleados/editar", { empleado, req });
  });
});

router.get("/eliminar/:id", (req, res, next) => {
  const { id } = req.params;
  empleadoService.getEmpleado(id).then(empleado => {
    res.render("empleados/eliminar", { empleado, req });
  });
});
  
router.post('/', async (req,res) =>{
    const {identificacion, nombre, apellido,  direccion,  localidad, email,  fecha_nacimiento, telefono} = req.body;
    let errores = null;
    try {
        const persona = await personaService.createPersona(identificacion, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono)        
        const empleado = await empleadoService.createEmpleado(persona.id);
    } catch (error) {
        try {
            const persona = await personaService.getPersonaArgs({identificacion});
            await empleadoService.createEmpleado(persona.id)
        } catch (error) {
            errores = error;
        }
    }
    if(errores){
      res.render('empleados/agregar',{errores,req})   
    }else{
      res.redirect('/empleados');
    }
})

router.put("/", (req, res, next) => {
  personaService.updatePersona(req.body)
    .then(() => {
        res.redirect("/empleados");
    });
});

router.delete("/", (req, res, next) => {
  const { id } = req.body;
  empleadoService.deleteEmpleado(id).then(() => {
    res.redirect("/empleados");
  });
});

module.exports = router;