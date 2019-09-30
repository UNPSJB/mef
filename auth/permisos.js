function estaLogueado(req,res,next){
    //tiene cookie userId, continua sino al login
    req.signedCookies.userId ? next() : res.redirect('/login');
} 

module.exports = {
    estaLogueado,
}