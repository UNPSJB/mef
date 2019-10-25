'use strict'
// ALEX ESTUVO ACA, Y LAUTARO TAMBIEN
module.exports = (sequelize, DataTypes) =>{
    const Presupuestado = sequelize.define('Presupuestado', {
        descripcion : DataTypes.STRING,
        cantidad_huesos : DataTypes.INTEGER,
        monto : DataTypes.FLOAT,
        fecha_fin_oferta : DataTypes.DATEONLY
    });
    Presupuestado.associate = function (models){
        models.Presupuestado.belongsTo(models.Pedido);
        // models.Presupuestado.belongsTo(models.Cliente);
    }
    return Presupuestado;
}

// asignarHuesos(colHuesos)
// 