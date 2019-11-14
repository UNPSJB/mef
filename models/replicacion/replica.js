'use strict'
module.exports = (sequelize, DataTypes) =>{
    const Replica = sequelize.define('Replica', {
        codigo: DataTypes.STRING,
        fecha_inicio: DataTypes.DATEONLY,
        fecha_fin: DataTypes.DATEONLY,
        fecha_baja:DataTypes.DATEONLY,
        obs: DataTypes.STRING,
        PedidoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Pedidos',
                key:'id'
            }
        },
        HuesoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Huesos',
                key:'id'
            }
        }
    });
    Replica.associate = function (models){
        models.Replica.belongsTo(models.Pedido);
        models.Replica.belongsTo(models.Hueso);
        // models.Replica.belongsTo(models.Exhibicion);
    }
    return Replica;
}

//
//