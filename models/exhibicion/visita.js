'use strict';
module.exports = (sequelize, DataTypes) => {

    const Visita = sequelize.define('Visita', {
        GuiaId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Guia',
                key:'id'
            }
        },
        ExhibicionId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Exhibicions',
                key:'id'
            }
        },
        ClienteId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Clientes',
                key:'id'
            }
        },
        cantidadDePersonas: DataTypes.INTEGER,
        fechaVisita: DataTypes.DATEONLY,
        horario: DataTypes.STRING,
        precio: DataTypes.FLOAT,
        cancelada: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['Verdadero', 'Falso']
        },
    })
    return Visita;
}