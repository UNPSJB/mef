'use strict';
module.exports = (sequelize, DataTypes) => {
    // Las relaciones estan en persona
    const Visita = sequelize.define('Visita', {
        cantidadDePersonas: DataTypes.INTEGER,
        fechaVisita: DataTypes.DATEONLY,
        horario: DataTypes.STRING,
        precio: DataTypes.FLOAT,
        estado: DataTypes.STRING,
        observacion: DataTypes.STRING,
        cancelada: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    }, {
        paranoid: true
    })
    return Visita;
}