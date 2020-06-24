const express = require('express')
const router = express.Router()
const empleadoService = require('../services/empleado.js')
const personaService = require('../services/persona.js')
const paginate = require('../middlewares/paginate')
const { generatePagination } = require('../services/utils');


//lista todos los empleados
router.get('/', 
  async (req, res) => {  
    try {
      const empleados = await empleadoService.getAllEmpleados()
      res.render('empleados/empleado', { results:empleados, req })
    } catch (error) {
      res.redirect('/404')    
    }
})

router.get('/agregar', (req, res) => {
    res.render('empleados/agregar', { req })
})

router.get('/editar/:id', (req, res) => {
  const { id } = req.params
  //ver cuando id no existe
  empleadoService.getEmpleado(id).then(empleado => {
    res.render('empleados/editar', { empleado, req })
  })
})

router.get('/eliminar/:id', (req, res) => {
  const { id } = req.params
  empleadoService.getEmpleado(id).then(empleado => {
    res.render('empleados/eliminar', { empleado, req })
  })
})
  
router.post('/', async (req, res) =>{
    const {identificacion, nombre, apellido,  direccion,  localidad, email,  fecha_nacimiento, telefono} = req.body
    try {
        const persona = await personaService.createPersona(identificacion, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono)        
        const empleado = await empleadoService.createEmpleado(persona.id)
        res.redirect('/empleados')
    } catch (error) {
        try {
            const persona = await personaService.getPersonaArgs({identificacion})
            await empleadoService.createEmpleado(persona.id)
            res.redirect('/empleados')
        } catch (error) {
          /** @TODO agregar objeto persona y empleado */
            const { message } = error.errors[0]
            res.render('empleados/agregar',{errores: message, empleado: req.body ,req})   
        }
    }
})

router.put('/', async (req, res) => {
  let empleado = req.body
  try {
    const persona = await personaService.getPersona(empleado.idPersona)
    await persona.update({
      ...empleado
    })
  } catch (error) {
    const { message } = error.errors[0]
    const empleadoDB = await empleadoService.getEmpleado(empleado.idEmpleado)
    res.render('empleados/editar',{errores: message, empleado:empleadoDB ,req})    
  }
})

router.delete('/', (req, res) => {
  const { id } = req.body
  empleadoService.deleteEmpleado(id).then(() => {
    res.redirect('/empleados')
  })
})

module.exports = router