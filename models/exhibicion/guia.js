// Persona (#54 )
// Fecha de alta
// Días en que trabaja
// Horario de trabajo
// Idiomas [1..n]

'use strict';
module.exports = (sequelize,DataTypes) => {
    const Guia = sequelize.define('Guia', {
        dias_trabaja: {
            type:DataTypes.STRING,
            defaultValue: "Lun-Mar-Mie-Jue-Vie"
        },
        fecha_alta: {
            type: DataTypes.DATEONLY
        },  //Variable que proviene de la clase rol
        horario_trabaja: {
            type:DataTypes.STRING,
            defaultValue: "8hs-20hs"
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
// y muchasVISITAS GUIADAS tiene muchos GUIAS