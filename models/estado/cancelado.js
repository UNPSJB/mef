'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cancelado extends Sequelize.Model{
        reanudar(){

        }
    }
    Cancelado.init({
        fecha:DataTypes.DATE,
        fecha_baja:DataTypes.DATEONLY,
        obs: DataTypes.STRING,
        descripcion : {
            type: DataTypes.STRING,
            defaultValue: "Cancelado"
        },
        PedidoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Pedidos',
                key:'id'
            }
        } 
    },{sequelize});

    return Cancelado;
}
