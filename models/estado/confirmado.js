'use strict'
// ALEX ESTUVO ACA, Y LAUTARO TAMBIEN
module.exports = (sequelize, DataTypes) =>{
    const Confirmado = sequelize.define('Confirmado', {
        descripcion : {
            type: DataTypes.STRING,
            defaultValue: "Confirmado"
        },
        PedidoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Pedidos',
                key:'id'
            }
        }
    });
    Confirmado.associate = function (models){
        models.Confirmado.belongsTo(models.Pedido);
    }
    return Confirmado;
}

// 
//
//