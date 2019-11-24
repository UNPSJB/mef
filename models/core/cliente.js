'use strict';
module.exports = (sequelize,DataTypes) => {
    const Cliente = sequelize.define('Cliente', {
        descripcion: {
            type:DataTypes.STRING,
            defaultValue: "Cliente"
        },  //Variable que proviene de la clase rol
        tipo : {                        //Variable que proviene de la clase rol
            type: DataTypes.ENUM,
            allowNull: false,   
            values: ['Particular','Institucional']
        },
        fecha_fin: DataTypes.DATEONLY,
        PersonaId:{
			type: DataTypes.INTEGER,
			references: {
				model:'Personas',
				key:'id',
			}
		}
    })

    Cliente.associate = function(models){
        models.Cliente.belongsTo(models.Persona);
    };
    return Cliente;
}
