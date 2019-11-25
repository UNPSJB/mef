'use strict'
const userService = require('./user');
const bcrypt = require('bcrypt');

module.exports = {
  auth(email, password) {
    return userService.findUser(email)
      .then(user => {
        return bcrypt.compare(password,user.password).then(()=>{
          return user
        })
      }).catch( e=>{
        return null;
      });
  },
}