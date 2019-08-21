/**
 * Aca el ORM hace su magia we
 * 
 */

import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect:'postgres',
  },
);

const models = {
  //si el modelo no esta aca, no se hace la tabla ni las relaciones
  Clase: sequelize.import('./clase'),
  Dinosaurio: sequelize.import('./dinosaurio'),
  Alimentacion: sequelize.import('./alimentacion'),
}

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };
export default models;