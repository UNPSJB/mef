'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) =>{
	const User = sequelize.define('User',{
		email:{
			type: DataTypes.STRING,
			allowNull : false,
			unique: true
		},
		password: DataTypes.STRING,
		RolId:{
			type: DataTypes.INTEGER,
			references:{
				model:'Rols',
				key:'id'
			}
		},
		PersonaId:{
			type: DataTypes.INTEGER,
			references: {
				model:'Personas',
				key:'id'
			}
		}
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