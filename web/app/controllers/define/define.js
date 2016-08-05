/**
 * Created by Leo on 16/8/2.
 */
const Car = require('../../models/Car');
const Log = require('../../models/Log');
const PasswordCrypto = require('../../common/Crypto').passwordCrypto;
const Config = require('../../../../config');
module.exports.Q = function*(message) {
	return new Promise((resolve, reject) => {
		var action = message.text;
		if (message.text.indexOf('#create#') === 0) {
			action = '#create#';
		}

		switch (action) {
			case '#create#': {
				try {
					const createParam = message.text.split('#');
					if (createParam.length !== 4) {
						throw new Error('车牌绑定格式不正确\n' + Config.baymax.createTip);
					}
					const license_plate = createParam[2];
					const password = createParam[3];
					if (password.length < 4 || password.length > 16) {
						throw new Error('车牌绑定格式不正确\n密码(4-16位字符组合)');
					}
					if (license_plate.length < 4 || license_plate.length > 10) {
						throw new Error('车牌绑定格式不正确\n车牌(4-16位字符组合)');
					}
					createCar(license_plate, password, message.user, resolve, reject);

				} catch (e) {
					resolve({
						type: 'text',
						data: {
							text: e.message
						}
					})
				}
				break;
			}
			case '#show#': {
				var license_plate = '';
				var question_count = 0;

				Promise.all(
					[
						Car.findOne({
							where: {
								slack_userid: message.user
							},
							raw: true
						}).then((car) => {
							if (car) {
								license_plate = car.license_plate;
							}
						}),
						Log.count({
							where: {
								slack_userid: message.user
							}
						}).then((num) => {
							question_count = num;
						})
					]
				).then(() => {
					var resText = '';
					if (license_plate) {
						resText += 'hi,你已绑定车牌 *' + license_plate + '* \n';
					} else {
						resText += 'hi,你尚未绑定车牌哦'
					}
					resText += '截止目前,Baymax已为你响应 *' + question_count + '* 次指令\n';
					resolve({
						type: 'text',
						data: {
							text: resText
						}
					});
				});
				break;
			}
			default: {
				resolve(null);
			}
		}
	});
};

function createCar(license_plate, password, slackUserid, resolve, reject) {

	Car.findOne({
		where: {
			license_plate: license_plate
		}
	}).then(function (carRow) {
		if (carRow) {
			//车牌已存在
			if (carRow.slack_userid === slackUserid) {
				//车牌属于用户本人
				carRow.update({
					password: PasswordCrypto(password)
				}).then(() => {
					resolve({
						type: 'text',
						data: {
							text: '已经为你更新车牌 *' + license_plate + '* 信息\n你可以使用下面的网址训练你的Baymax\n' + Config.baymax.trainUrl
						}
					});
				});
			} else {
				//车牌属于别人
				resolve({
					type: 'text',
					data: {
						text: '车牌 *' + license_plate + ' *已有人绑定了哦\n请仔细确认你输入的车牌号\n' + '若有人使用了你的车牌,请联系管理员修改\n管理员邮箱: leohuangyi@foxmail.com',
					}
				});
			}
		} else {
			//车牌不存在
			Car.findOne({
				where: {
					slack_userid: slackUserid
				}
			}).then((resCar) => {
				return new Promise((resolve) => {
					if (resCar) {
						resCar.destroy().then(()=> {
							resolve('rewrite');
						});
					} else {
						resolve('new')
					}
				});
			}).then(() => {
				Car.create({
					license_plate: license_plate,
					slack_userid: slackUserid,
					password: PasswordCrypto(password)
				}).then((car) => {
					resolve({
						type: 'text',
						data: {
							text: '绑定车牌* ' + car.license_plate + ' *成功啦\n你可以使用下面的网址训练你的Baymax\n' + Config.baymax.trainUrl
						}
					});
				}).catch((e) => {
					resolve({
						type: 'text',
						data: {
							text: '绑定车牌失败啦\n' + e.errors.map((error) => {
								return error.message
							}).join('\n')
						}
					});
				});
			});
		}
	});
}
