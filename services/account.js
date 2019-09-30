const userService = require('./user');

module.exports = {

  auth(email, password) {
    return userService.findUser(email)
      .then(user => {
        return user;
      }).catch( e=>{
        return null;
      });
  }
}