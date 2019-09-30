'use strict'
const userService = require('./user');
const bcrypt = require('bcrypt');

module.exports = {
  auth(email, password) {
    return userService.findUser(email)
      .then(user => {
        console.log(user);
        return user;
      }).catch( e=>{
        return null;
      });
  },
  // roleExist : (r) => (req, res, next) => {
  //   if (req.session.roles.indexOf(r) === -1) {
  //     res.redirect('/users/login');
  //   } else {
  //     next();
  //   }
  // }
}