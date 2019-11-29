const models = require('../models');

module.exports = {
    getExhibiciones(){
        return models.Exhibicion.findAll();
    }
}