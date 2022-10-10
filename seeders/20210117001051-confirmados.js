'use strict';
const MAX = 300;
module.exports = {
  up: (queryInterface, Sequelize) => {

    let confirmadoArr = [];

    for (let index = 1; index <= MAX; index++) {
      let confirmadoObj = {
        descripcion: "Confirmado",
        fecha: new Date(),
        PedidoId: index,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }
      confirmadoArr.push(confirmadoObj)


    }
    return queryInterface.bulkInsert('Confirmados', confirmadoArr, {})
    /*
      Add {
        descripcion : {
            type: DataTypes.STRING,
            defaultValue: "Confirmado"
        },
        fecha:{
            type: DataTypes.DATE,
            defaultValue: new Date(),
            allowNull:false
        },
        PedidoId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Pedidos',
                key:'id'
            }
        }
    */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
