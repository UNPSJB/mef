const models = require('../models');
let Rol = models.Rol;

module.exports = {
    getRols(){
        return Rol.getAll();
    }
}