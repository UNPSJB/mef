'use strict';
module.exports = (sequelize,DataTypes) => {
    const Idioma = sequelize.define('Idioma', {
        nombre:DataTypes.STRING
    },{
        paranoid:true
    })
    return Idioma;
}
