const models = require('../models')
let User = models.User;
let Rol = models.Rol;

module.exports = {
  getUsers() {
  },
  findUser(email) { 
    return User.findOne({
      where: {
        email
      },
      include:Rol
    });
  },
  createUser(email, password) {
    return User.create({
        email,
        password
    });
  }
}