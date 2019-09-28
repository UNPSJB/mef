'use strict'
const userService = require('./user');
const bcrypt = require('bcrypt');

module.exports = {
  auth(email, password) {
    userService.findUser(email)
      .then(async user => {
        if (!user) return null;
        let comparar = await bcrypt.compare(password,user.password);
        console.log(comparar);
        //if (user.password !== password) return null;
        return user;
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