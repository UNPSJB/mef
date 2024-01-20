'use strict'
const permisos = require('../middlewares/permisos');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Rols',[{
      descripcion:'taller', // id:1
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      descripcion:'coleccion', // id:2 
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      descripcion:'rrhh', // id:3
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      descripcion:'secretaria', // id:4
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      descripcion:'exhibicion', // id:5
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})

    await queryInterface.bulkInsert('Users', [{
      email: 'admin@mef',
      password: await bcrypt.hashSync('admin',10),
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      email: 'taller@mef',
      // user.password = bcrypt.hashSync(user.password,10);
      password: await bcrypt.hashSync('taller',10),
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      email:'coleccion@mef',
      password: await bcrypt.hashSync('coleccion',10),
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      email:'rrhh@mef',
      password: await bcrypt.hashSync('rrhh',10),
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      email: 'secretaria@mef',
      password: await bcrypt.hashSync('secretaria',10),
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      email: 'exhibicion@mef',
      password: await bcrypt.hashSync('exhibicion',10),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
    
    return queryInterface.bulkInsert('UsersRoles', [
    {
      UserId: 1,
      RolId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      UserId: 1,
      RolId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      UserId: 1,
      RolId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      UserId: 1,
      RolId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      UserId: 1,
      RolId: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      UserId: 2,
      RolId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      UserId: 3,
      RolId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      UserId: 4,
      RolId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      UserId: 5,
      RolId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      UserId: 6,
      RolId: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {})

   /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
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
