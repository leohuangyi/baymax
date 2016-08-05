/**
 * Created by Leo on 16/8/1.
 */
const Car = require('../models/Car');
const Questions = require('../models/Questions');
const Log = require('../models/Log');
const Road = require('../models/Road');
module.exports.init = function () {
	return Promise.all([
		new Promise((resolve) => {
			Car.sync().then(
				() => {
					return resolve('Create Car Table Success');
				}
			);
		}),
		new Promise((resolve) => {
			Questions.sync().then(
				() => {
					return resolve('Create Questions Table Success');
				}
			);
		}),
		new Promise((resolve) => {
			Log.sync().then(
				() => {
					return resolve('Create Log Table Success');
				}
			);
		}),
		new Promise((resolve) => {
			Road.sync().then(
				() => {
					return resolve('Create Road Table Success');
				}
			);
		})
	]).then(() => {
		return '数据库初始化成功';
	});
};
