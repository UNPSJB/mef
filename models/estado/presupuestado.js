'use strict'
// ALEX ESTUVO ACA, Y LAUTARO TAMBIEN
module.exports = (sequelize, DataTypes) =>{
   class Presupuestado extends Sequelize.Model{

   }
   Presupuestado.init({
    fecha:DataTypes.DATEONLY,
    descripcion : DataTypes.STRING,
    cantidad_huesos : DataTypes.INTEGER,
    monto : DataTypes.FLOAT,
    fecha_fin_oferta : DataTypes.DATEONLY,
    PedidoId:{
        type:DataTypes.INTEGER,
        references:{
            model:'Pedidos',
            key:'id'
        }
    }
   }, {sequelize});
   
   Presupuestado.belongsTo(Pedido);
   return Presupuestado;
}

// asignarHuesos(colHuesos)
