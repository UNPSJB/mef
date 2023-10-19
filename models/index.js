'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

var sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
// https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs

const subfolders = (source) => fs.
  readdirSync(source, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);


// subcarpetas
const models = subfolders(__dirname).map(sub => {
  if (sub === "estado") return [];
  let ruta = __dirname + '/' + sub;
  return fs.readdirSync(ruta)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .map(file => sequelize['import'](path.join(ruta, file)));
}).reduce((acc, models)=> [...acc, ...models], []);

const db = models.reduce((acc, model) => Object.assign(acc, {[model.name] : model}), {});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize; //estas lineas son diferentes, no eliminar
module.exports = db;
