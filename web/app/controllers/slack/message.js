/**
 * Created by Leo on 16/8/1.
 */
const DefineQ = require('../define/define').Q;
const DbQ = require('../db/db').Q;
const TulingQ = require('../tuling/tuling').Q;
const Car = require('../../models/Car');
const Config = require('../../../../config');
const Log = require('../../models/Log');
module.exports.message = function *message(ctx) {
	var message = this.request.body;
	var finalRes = {
		type: '',
		data: {}
	};
	var processed = false;  //如果该变量为true,后续的问题匹配将不会再继续
	//预定义指令查询
	if (!processed) {
		var defineData = yield DefineQ(message);
		if (defineData) {
			processed = true;
			finalRes = defineData;
		}
	}

	//检测是否绑定车牌
	if (!processed) {
		var carData = yield function*() {
			return new Promise((resovle, reject)=> {
				Car.findOne({
					where: {
						slack_userid: message.user
					}
				}).then((car) => {
					if (!car) {
						resovle(null);
					} else {
						resovle(car);
					}
				})
			});
		};
		if (!carData) {
			processed = true;
			finalRes = {
				type: 'text',
				data: {
					text: '你还没有绑定车牌哦,请使用下面的方法绑定\n' + Config.baymax.createTip
				}
			}
		}
	}

	//训练数据库
	if (!processed) {
		var dbData = yield DbQ(message, carData.id);
		if (dbData) {
			processed = true;
			finalRes = dbData;
		}
	}
	//图灵机器人
	if (!processed) {
		var tulingData = yield TulingQ(message);
		if (tulingData) {
			processed = true;
			finalRes = tulingData;
		}
	}

	//统计信息入库
	Log.create({
		slack_userid: message.user,
		question: message.text,
		answer: finalRes.data.text
	})

	finalRes.data.channel = message.channel;
	this.body = finalRes;
};
