const TALLER = 'taller';
const COLECCION = 'coleccion';
const EXHIBICION = 'exhibicion';
const RRHH = 'rrhh';
const SECRETARIA = 'secretaria';

const ROLES = [
    TALLER,
    COLECCION,
    EXHIBICION,
    RRHH,
    SECRETARIA
]

const FABRICAR = 'fabricar'
const DEMORAR = 'demorar'
const REANUDAR = 'reanudar'
const FINALIZAR = 'finalizar'
const ENTREGAR = 'entregar'
const QUITAR = 'quitar'
const EMPLEADOS = 'empleados'

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
    EMPLEADOS
}

module.exports = {
    ROLES,
    estaLogueado(req, res, next){
        // next()
        //tiene cookie userId, continua sino al login
        req.session.userId ? next() : res.redirect('/login');//@TODO cambiar, agregar mas experiencia
    },
    redirectHome(req, res, next){
        req.session.userId ? res.redirect('/') : next();   //@TODO cambiar, agregar mas experiencia
    },
    asignaPermisos(req, res, next) {
        const { session : { rol } } = req
        if ( rol ) {
            rol.forEach(item => {
                const nombre = item.descripcion
                if (ROLES.includes(nombre)) { 
                    req[nombre] = true
                } else { 
                    req[nombre] = false
                }
            })
        }
        next()
    },
    esExhibicion(req, res, next){
        console.log(req, req.session, req.session.roles, typeof req.session.roles)
        next()
        // req.session.roles.includes === ROLES.EXHIBICION ? next() : res.redirect('/error'); //@TODO cambiar, agregar mas experiencia
    },
    esTaller(req, res, next){
        // req.session.rol === ROLES.TALLER ? next() : res.redirect('/error') ////@TODO cambiar, agregar mas experiencia
    }, 
    esColeccion(req, res, next){
        const { session: { rol } } = req
        if( rol ) {
            const coleccion = rol.filter(item => item.descripcion == 'coleccion')
            req.coleccion = coleccion ? true : false
            console.log(req.coleccion)
        }
        next()
        // req.session.rol === ROLES.COLECCION ? next() : res.redirect('/error') //@TODO cambiar, agregar mas experiencia
    },
    permisosParaEstado(){
        return function(req, res, next){
            switch(req.params.accion){
                case FABRICAR:
                case DEMORAR:
                case REANUDAR:
                case FINALIZAR:
                case ENTREGAR:
                case QUITAR:
                case EMPLEADOS:
                case PRESUPUESTAR:
                case CANCELAR:
                case FACTURAR:
                case CONFIRMAR:
                    return next()
                default:
                    return res.redirect('404');             
            }
        }
    },
    permisoPara(args){ //aca van quienes tienen permiso
        // const rol = req.session.rol;
        return function (req, res, next) {
            if(args.includes([...req.session.rol])){
                return next(); //tiene session y permiso
            }else{
                console.log('No estas logueado');
                return res.redirect('/403');
            }
        }
    }
}