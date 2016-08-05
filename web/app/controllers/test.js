/**
 * Created by Leo on 16/8/1.
 */

const Car = require('../models/Car');
module.exports.test = function *() {
  this.body = yield new Promise((resolve) => {
    Car.create({
      license_plate: Date.now(),
      password: '123456'
    }).then((data) => {
      resolve(data);
    });
  });
};
