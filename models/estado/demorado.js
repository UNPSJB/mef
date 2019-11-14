'use strict'
const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) =>{
    class Demorado extends Sequelize.Model{

    }
    Demorado.init({
        fecha:DataTypes.DATE,
        descripcion : {
            type:DataTypes.STRING,
            defaultValue:'Demorado',
            allowNull:false  
        } ,
        retraso_estimado: DataTypes.STRING, //3 meses, 2 semanas, dos semanas, cinco anos
        PedidoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Pedidos',
                key:'id'
            }
        }
    }, {sequelize});
    Demorado.associate = function (models){
        models.Demorado.belongsTo(models.Pedido);
    }
    return Demorado;
}

