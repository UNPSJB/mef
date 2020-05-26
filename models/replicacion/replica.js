'use strict'
module.exports = (sequelize, DataTypes) =>{
    const Replica = sequelize.define('Replica', {
        disponible: DataTypes.BOOLEAN,
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
    },{
        paranoid:true,
        sequelize
    });
    Replica.associate = function (models){
        models.Replica.belongsTo(models.Pedido);
        models.Replica.belongsTo(models.Hueso);
        
    }
    return Replica;
}
