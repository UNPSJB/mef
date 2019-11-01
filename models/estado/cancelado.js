'use strict'
// ALEX ESTUVO ACA, Y LAUTARO TAMBIEN
module.exports = (sequelize, DataTypes) =>{
    const Cancelado = sequelize.define('Cancelado', {
        fecha:DataTypes.DATE,
        fecha_baja:DataTypes.DATEONLY,
        obs: DataTypes.STRING,
        descripcion : {
            type: DataTypes.STRING,
            defaultValue: "Cancelado"
        },
        
    });
    Cancelado.associate = function (models){
        models.Cancelado.belongsTo(models.Pedido);
        
    }
    return Cancelado;
}