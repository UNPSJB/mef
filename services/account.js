const userService = require('./user');

module.exports = {

  auth(email, password) {
    return userService.findUser(email)
      .then(user => {
        if (!user) return null;
        if (user.password !== password) return null;
        return user;
      });
  }
}