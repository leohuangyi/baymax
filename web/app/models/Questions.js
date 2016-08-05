/**
 * Created by Leo on 16/8/1.
 */
const Conn = require('./conn');
const Sequelize = require('sequelize');
module.exports = Conn.define('questions', {
  id: {
    autoIncrement: true,
    type: Sequelize.INTEGER.UNSIGNED,
    unique: true,
    primaryKey: true
  },
  question: Sequelize.TEXT,
  answer: Sequelize.TEXT,
  type: Sequelize.INTEGER.UNSIGNED,
  car_id: Sequelize.INTEGER.UNSIGNED
});

