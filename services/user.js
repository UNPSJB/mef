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
  createUser(user) {
    const { email, password } = user.body;
    return Promise.resolve(
      User.create({
        email,
        password
      })
    );
  }
}