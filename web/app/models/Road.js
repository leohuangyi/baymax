/**
 * Created by Leo on 16/8/1.
 */
const Conn = require('./conn');
const Sequelize = require('sequelize');
module.exports = Conn.define('road', {
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		autoIncrement: true,
		unique: true,
		primaryKey: true
	},
	slack_userid: {
		type: Sequelize.STRING,
	},
	road: {
		type: Sequelize.TEXT,
	}
});
