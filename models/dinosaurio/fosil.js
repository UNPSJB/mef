// Diccionario de datos


// Hueso (#6)
// Numero de Colección
// Peso (KG)
// Disponible [VERDADERO | FALSO]
// Fecha Encontrado[dd/mm/yyyy]
// Observación

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Fosil = sequelize.define('Fosil', {
      numero_coleccion: {
          type:DataTypes.STRING,
          allowNull:false,
      },
      peso: DataTypes.FLOAT,
      disponible: DataTypes.BOOLEAN,
      fecha_encontrado: DataTypes.DATEONLY,
      observacion: DataTypes.STRING
  });

  Fosil.associate = function(models) {
      models.Fosil.belongsTo(models.Hueso);
  };
  return Fosil;
};
