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

const FABRICAR = 'fabricar'
const DEMORAR = 'demorar'
const REANUDAR = 'reanudar'
const FINALIZAR = 'finalizar'
const ENTREGAR = 'entregar'
const QUITAR = 'quitar'
const ASIGNAR = 'asignar'

const PRESUPUESTAR = 'presupuestar'
const CANCELAR = 'cancelar'
const FACTURAR = 'facturar'
const CONFIRMAR = 'confirmar'


const EXHIBICION_ESTADOS = {
    PRESUPUESTAR,
    CANCELAR,
    FACTURAR,
    CONFIRMAR,
} 
const TALLER_ESTADOS = {
    FABRICAR,
    DEMORAR,
    REANUDAR,
    FINALIZAR,
    ENTREGAR,
    QUITAR,
    ASIGNAR
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
    permisosParaEstado(){
        return function(req,res,next){
            console.log(req.params)
            switch(req.params.accion){
                case FABRICAR:
                case DEMORAR:
                case REANUDAR:
                case FINALIZAR:
                case ENTREGAR:
                case QUITAR:
                case ASIGNAR:
                    if(req.session.rol === ROLES.TALLER){
                        return next();
                    }else{
                        return res.redirect('/403');
                    }
                case PRESUPUESTAR:
                case CANCELAR:
                case FACTURAR:
                case CONFIRMAR:
                    if(req.session.rol === ROLES.EXHIBICION){
                        return next()
                    }else{
                        return res.redirect('/403');
                    }
                default:
                    return res.redirect('404');             
            }
        }
    },
    permisoPara(args){ //aca van quienes tienen permiso
        // const rol = req.session.rol;
        return function (req,res,next) {
            if(args.includes(req.session.rol)){
                return next(); //tiene session y permiso
            }else{
                console.log('no estas logueado');
                return res.redirect('/403');
            }
        }
    }
}