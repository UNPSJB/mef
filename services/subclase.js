const models = require('../models')
let subclase = models.SubClase;

class SubclaseService{
    constructor(){}

    getSubclases(){
        return Promise.resolve(subclase.findAll()).catch((e)=>{console.log(e)});
    }

}

module.exports = SubclaseService;