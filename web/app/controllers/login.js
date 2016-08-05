/**
 * Created by Leo on 16/8/2.
 */
const Car = require('../models/Car');
const crypto = require('../common/Crypto').passwordCrypto;
module.exports.login = function* () {
    const params = this.request.body;
    const license = params.license;
    const password = params.password;

    this.body = yield new Promise(resolve => {
        Car.findOne({
            where: {
                license_plate: license
            }
        }).then(data => {
            if (data) {
                crypto(password) != data.password && resolve({
                    errorMessage: '密码错误'
                });
                resolve({
                    id: data.id,
					user_id: data.slack_userid,
                    license_plate: data.license_plate,
                    nick_name: data.nick_name
                })
            } else {
                resolve({
                    errorMessage: '该车牌号尚未注册'
                })
            }
        })
    })
}
