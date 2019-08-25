'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubTipoHueso = sequelize.define('SubTipoHueso', {
    nombre: DataTypes.STRING
  }, {});
  SubTipoHueso.associate = function(models) {
    // associations can be defined here
    models.SubTipoHueso.belongsTo(models.TipoHueso);
  };
  return SubTipoHueso;
};