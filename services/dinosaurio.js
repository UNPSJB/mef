const models = require('../models')
const { paginateModel } = require('./utils')

module.exports = {
  getAllDinosaurios(){
    return models.Dinosaurio.findAll({
      include: [models.SubClase]
    })
  },
  getDinosaurios(page = 0, pageSize = 10, args) {//{ tags }//aca se pide datos a la BD        
    return models.Dinosaurio.findAndCountAll({
      include: [models.SubClase],
      where: {
        ...args
      },
      ...paginateModel({ page, pageSize })
    })
  },
  getDinosaurio(id) {
    return models.Dinosaurio.findByPk(id)
  },
  createDinosaurio(nombre, alimentacion, periodo, descubrimiento, SubClaseId) {
    return models.Dinosaurio.create({
      nombre,
      alimentacion,
      periodo,
      descubrimiento,
      SubClaseId
    })
  },
  updateDinosaurio(dinoReq) {
    return models.Dinosaurio.upsert(dinoReq) //update or insert = upsert XD    
  },
  deleteDinosaurio(id) {
    return models.Dinosaurio.findByPk(id)
      .then((dinoEncontrado) => {
        //existe ? lo modifico
        return dinoEncontrado.destroy(dinoEncontrado)
      })//dino no existe
  }
}