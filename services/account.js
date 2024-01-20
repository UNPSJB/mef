'use strict'
const userService = require('./user');
const bcrypt = require('bcrypt');

module.exports = {
  auth(email, password) {
    return userService.findUser(email)
      .then(user => {
        return bcrypt.compare(password,user.password).then(acceso=>{
          if (acceso){
            return user;
          }else{
            return null;
          }
        })
      }).catch( e=>{
        return null;
      });
  },
}