'use strict';
module.exports = (sequelize, DataTypes) => {
    // Las relaciones estan en persona
    const Visita = sequelize.define('Visita', {
        cantidadDePersonas: DataTypes.INTEGER,
        fechaVisita: DataTypes.DATEONLY,
        horario: DataTypes.STRING,
        precio: DataTypes.FLOAT,
        cancelada: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },{
        paranoid:true
    })
    return Visita;
}
