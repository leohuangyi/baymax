/**
 * Created by Leo on 16/8/3.
 */
const Car = require('../../models/Car');
const Log = require('../../models/Log');
const Dbconn = require('../../models/conn');
const Moment = require('moment');
//返回baymax对相应车牌对应的用户的响应次数
function *getCount(license_plate) {
	return new Promise(function (resolve, reject) {
		Car.findOne({
			where: {
				license_plate: license_plate
			}
		}).then((car) => {
			if (!car) {
				//找不到对应的车牌
				resolve(null);
			}
			Log.count({
				where: {
					slack_userid: car.slack_userid
				}
			}).then(num => {
				resolve({
					slack_userid: car.slack_userid,
					question_count: num
				})
			});
		});
	});
};

module.exports.getCount = getCount;
module.exports.count = function *count() {
	//返回baymax对相应车牌对应的用户的响应次数
	var res = {
		data: {
			slack_userid: '',
			question_count: 0
		}
	};

	var license_plate = this.request.query.license_plate;
	if (!license_plate || license_plate.length < 4) {
		this.body = res;
		return;
	}

	var countData = yield getCount(license_plate);
	if (countData) {
		res.data.slack_userid = countData.slack_userid;
		res.data.question_count = countData.question_count;
	}

	this.body = res;
};

module.exports.countDay = function *countDay() {
	var res = {
		data: {
			userDatas: {
				x: [],
				y: []
			},
			allDatas: {
				x: [],
				y: []
			}
		}
	};
	yield function *() {
		return new Promise((resolve, reject) => {
			var license_plate = this.request.query.license_plate;
			if (!license_plate || license_plate.length < 4) {
				resolve(res);
				return;
			}

			Car.findOne({
				where: {
					license_plate: license_plate
				}
			})
				.then((car) => {
					if (!car) {
						//找不到对应的车牌
						resolve(res);
					}
					return car;
				})
				.then((car) => {
					//返回近10天每天Baymax的响应次数统计
					var countUserSql = `SELECT DATE(createdAt) AS ForDate,
						COUNT(*) AS num
					 FROM   logs
					 WHERE slack_userid = '${car.slack_userid}'
					 GROUP BY DATE(createdAt)
					 ORDER BY ForDate Desc
					`;

					var countAllSql = `SELECT DATE(createdAt) AS ForDate,
						COUNT(*) AS num
					 FROM   logs
					 GROUP BY DATE(createdAt)
					 ORDER BY ForDate Desc
					`;

					function dataFormat(results) {
						var data = {
							x: [],
							y: []
						};
						results = results.splice(0, 10).reverse();
						results.forEach((dateInfo) => {
							data.x.push(
								Moment(dateInfo.ForDate).format("YYYY-MM-DD")
							);
							data.y.push(
								dateInfo.num
							)
						});
						return data;
					}

					Promise.all([
						new Promise((resolveJ) => {
							Dbconn.query(countUserSql, {raw: true}).spread(function (results, metadata) {
								var data = dataFormat(results);
								res.data.userDatas = data;
								resolveJ(data);
							})
						}),
						new Promise((resolveJ) => {
							Dbconn.query(countAllSql, {raw: true}).spread(function (results, metadata) {
								var data = dataFormat(results);
								res.data.allDatas = data;
								resolveJ(data);
							})
						})
					]).then(() => {
						resolve(res);
					});
				});
		});
	}

	this.body = res;
};

