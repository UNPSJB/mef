const models = require('../models')
let fosil = models.Fosil;

module.exports ={
    getFosiles(){
        return fosil.findAll();
    },
    getFosil(id){
        return fosil.findByPk(id);
    },
    createFosil(numero_coleccion,peso,disponible,fecha_encontrado,observacion){
        // req.flash('success', 'Link agregado correctamente');
        return fosil.create({
                numero_coleccion,
                peso,
                disponible,
                fecha_encontrado,
                observacion
            });
    },
    updateFosil(fosilReq){
        return fosil.upsert(fosilReq) //update or insert = upsert XD
                .catch(() =>{// sale mal
                    console.log("fosil update sale mal");
                })    
    },
    deleteFosil(id){
        return fosil.findByPk(id)
            .then( (fosilEncontrado)=>{
                // existe ? lo modifico
                fosilEncontrado.destroy(fosilEncontrado);
            })// fosil no existe
            .catch( (err) =>{//preguntar sobre esto
                console.log("fosil no existe"+err)
            })
    }
}