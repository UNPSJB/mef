'use strict';
module.exports = (sequelize,DataTypes) => {
    const Empleado = sequelize.define('Empleado', {
        descripcion: {
            type:DataTypes.STRING,
            defaultValue: "Empleado"
        },  //Variable que proviene de la clase rol

        fecha_fin: DataTypes.DATEONLY,
        PersonaId:{
			type: DataTypes.INTEGER,
			references: {
				model:'Personas',
				key:'id',
			}
		}
    })

    Empleado.associate = function(models){
        models.Empleado.belongsTo(models.Persona);
    };
    return Empleado;
}