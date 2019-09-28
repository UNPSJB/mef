'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) =>{
	const User = sequelize.define('User',{
		email:DataTypes.STRING,
		password: DataTypes.STRING
	},{
		hooks:{
			afterValidate: (user) => {
				user.password = bcrypt.hashSync(user.password,10);
			}

		}
	});

	User.associate = function(models){
		models.User.belongsTo(models.Persona);
		models.User.belongsTo(models.Rol);
	};
	return User;
};