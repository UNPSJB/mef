const models = require('../models')

module.exports = {
  getUsers() {
  },
  findUser(email) { 
    return models.User.findOne({
      where: {
        email
      },
      include:models.Rol
    });
  },
  createUser(email, password) {
    return models.User.create({
        email,
        password
    });
  }
}