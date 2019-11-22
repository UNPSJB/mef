const TALLER = 'taller';
const COLECCION = 'coleccion';
const EXHIBICION = 'exhibicion';
const RRHH = 'rrhh';
const SECRETARIA = 'secretaria';

const ROLES = {
    TALLER,
    COLECCION,
    EXHIBICION,
    RRHH,
    SECRETARIA
}

module.exports = {
    ROLES,
    estaLogueado(req,res,next){
        //tiene cookie userId, continua sino al login
        req.session.userId ? next() : res.redirect('/login');//@TODO cambiar, agregar mas experiencia
    },
    redirectHome(req,res,next){
        req.session.userId ? res.redirect('/') : next();   //@TODO cambiar, agregar mas experiencia
    },
    esExhibicion(req,res,next){
        req.session.rol === ROLES.EXHIBICION ? next() : res.redirect('/error'); //@TODO cambiar, agregar mas experiencia
    },
    esTaller(req,res,next){
        req.session.rol === ROLES.TALLER ? next() : res.redirect('/error') ////@TODO cambiar, agregar mas experiencia
    }, 
    esColeccion(req,res,next){
        req.session.rol === ROLES.COLECCION ? next() : res.redirect('/error') //@TODO cambiar, agregar mas experiencia
    },
    permisoPara(args){ //aca van quienes tienen permiso
        // const rol = req.session.rol;
        return function (req,res,next) {
            if(req.session.rol in args){
                next(); //tiene session y permiso
            }
            console.log('no estas logueado');
            res.redirect('/403');
        }
    }
}