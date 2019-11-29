'use strict';
module.exports = (sequelize,DataTypes) => {
    const Visita = sequelize.define('Visita', {
        cantidadDePersonas: DataTypes.INTEGER,
        fechaVisita: DataTypes.DATEONLY,
        horario: DataTypes.STRING,
        precio: DataTypes.FLOAT, 
        cancelada : {                        //Variable que proviene de la clase rol
            type: DataTypes.ENUM,
            allowNull: false,   
            values: ['Verdadero','Falso']
        },
    })
    return Visita;
    // Exhibición (#28 )
    // Cliente (#42 )
    // Guía (#34 )
}