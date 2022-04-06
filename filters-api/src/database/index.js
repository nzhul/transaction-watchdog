'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const logger = require('../config/logger');
const basename = path.basename(__filename);
const config = require('./config/config');
const db = {};

const isDev = process.env.NODE_ENV === 'development';

let sequelize;
if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize('sqlite::memory:', { logging: false });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: isDev,
  });
}

const modelsPath = `${__dirname}/models`;

fs.readdirSync(modelsPath)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    const model = require(path.join(modelsPath, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

if (isDev) {
  logger.info('---Synchronizing database---');
}
db.sequelize.sync().then(() => {
  if (isDev) {
    logger.info('---Database sync complete---');
  }
});

module.exports = db;
