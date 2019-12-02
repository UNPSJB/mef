// Persona (#54 )
// Fecha de alta
// Días en que trabaja
// Horario de trabajo
// Idiomas [1..n]

'use strict';
module.exports = (sequelize,DataTypes) => {
    const Guia = sequelize.define('Guia', {
        dias_trabaja: {
            type:DataTypes.STRING.BINARY, 
            // Lunes 1000000
            // Martes 010000
            // Lun a Vie 1111100
            defaultValue: "1111100"
        },
        fecha_alta: {
            type: DataTypes.DATEONLY
        }, 
        horario_trabaja: {
            type:DataTypes.STRING.BINARY,
            // 9am a 20pm 11111111111111
            // 9am a 12am - 15pm a 20pm 11110001111
            defaultValue: "11110001111"
        },
        PersonaId:{
			type: DataTypes.INTEGER,
			references: {
				model:'Personas',
				key:'id',
			}
		}
    })
    return Guia;
}

// Un GUIA puede estar en muchas VISITAS GUIADAS 
// y muchas VISITAS GUIADAS tiene muchos GUIAS