'use strict'
// ALEX ESTUVO ACA, Y LAUTARO TAMBIEN
module.exports = (sequelize, DataTypes) =>{
    const Demorado = sequelize.define('Demorado', {
        descripcion : DataTypes.STRING,
        retraso_estimado: DataTypes.STRING, //3 meses, 2 semanas, dos semanas, cinco anos
        PedidoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Pedidos',
                key:'id'
            }
        }
    });
    Demorado.associate = function (models){
        models.Demorado.belongsTo(models.Pedido);
    }
    return Demorado;
}

// 
//
//