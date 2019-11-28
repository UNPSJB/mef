const models = require('../models')
const User = models.User;

module.exports = {
  getUsers() {
  },
  findUser(email) { 
    return User.findOne({
      where: {
        email
      },
      include:models.Rol
    });
  },
  createUser(email, password) {
    return User.create({
        email,
        password
    });
  }
}