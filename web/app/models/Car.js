/**
 * Created by Leo on 16/8/1.
 */
const Conn = require('./conn');
const Sequelize = require('sequelize');
module.exports = Conn.define('car', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    autoIncrement: true,
    unique: true,
    primaryKey: true
  },
  license_plate: {
    type: Sequelize.STRING,
    unique: true
  },
  slack_userid: {
    type: Sequelize.STRING,
    unique: true
  },
  password: Sequelize.STRING,
  nick_name: Sequelize.STRING
});
