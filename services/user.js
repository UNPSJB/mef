const models = require('../models')
let User = models.User;

module.exports = {
  getUsers() {
    // comentario
  },
  findUser(email) { 
    return User.findOne({
      where: {
        email
      }
    });
  },
  createUser(email, password) {
    return User.create({
        email,
        password
    });
  }
}