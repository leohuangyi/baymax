/**
 * Created by Leo on 16/8/1.
 */
const Sequelize = require('sequelize');
const Config = require('../../../config');

module.exports = new Sequelize(
  Config.db.database,
  Config.db.user,
  Config.db.password, {
    logging: false,
    host: Config.db.host,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }
);
