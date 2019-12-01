'use strict';
module.exports = (sequelize,DataTypes) => {
    const Idioma = sequelize.define('Idioma', {
        nombre:DataTypes.STRING
    })
    return Idioma;
}