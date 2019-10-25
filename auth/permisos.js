

module.exports = {
    estaLogueado(req,res,next){
        //tiene cookie userId, continua sino al login
        req.session.userId ? next() : res.redirect('/login');//@TODO cambiar, agregar mas experiencia
    },
    redirectHome(req,res,next){
        req.session.userId ? res.redirect('/') : next();   //@TODO cambiar, agregar mas experiencia
    },
    esExhibicion(req,res,next){
        req.session.rol === 'exhibicion' ? next() : res.redirect('/error'); //@TODO cambiar, agregar mas experiencia
    },
    esTaller(req,res,next){
        req.session.rol === 'taller' ? next() : res.redirect('/error') ////@TODO cambiar, agregar mas experiencia
    }, 
    esColeccion(req,res,next){
        req.session.rol === 'coleccion' ? next() : res.redirect('/error') //@TODO cambiar, agregar mas experiencia
    }
}