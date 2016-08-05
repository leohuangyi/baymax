/**
 * Created by Leo on 16/8/1.
 */
const Conn = require('./conn');
const Sequelize = require('sequelize');
module.exports = Conn.define('Log', {
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		autoIncrement: true,
		unique: true,
		primaryKey: true
	},
	slack_userid: {
		type: Sequelize.STRING
	},
	question: {
		type: Sequelize.TEXT
	},
	answer: {
		type: Sequelize.TEXT
	}
});
