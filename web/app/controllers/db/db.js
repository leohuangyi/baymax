/**
 * Created by Leo on 16/8/2.
 */
/**
 * Created by Leo on 16/8/2.
 */
const Questions = require('../../models/Questions');
module.exports.Q = function*(message, carId) {
  return new Promise((resolve) => {
    Questions.findOne({
      where: {
        question: message.text,
        $or: [
          {car_id: carId},
          {car_id: 0}
        ]
      },
      raw: true
    }).then((questionRow) => {
      //全匹配
      return new Promise((resolveFullQuery, rejectFullQuery) => {
        if (questionRow) {
          //全匹配成功
          resolve({
            type: 'text',
            data: {
              text: questionRow.answer
            }
          });
        } else {
          //全匹配失败
          rejectFullQuery();
        }
      });
    }).catch(() => {
      //正则匹配
      Questions.findAll({
        where: {
          type: 2,
          $or: [
            {car_id: carId},
            {car_id: 0}
          ]
        },
        raw: true
      }).then((regQuestions) => {
        if (regQuestions && regQuestions.length > 0) {
          var isBreak = false;
          regQuestions.forEach((regQuestion) => {
            if(isBreak) return;
            var reg = new RegExp(regQuestion.question, 'ig');
            if(reg.test(message.text)){
              resolve({
                type: 'text',
                data: {
                  text: regQuestion.answer
                }
              });
              isBreak = true;
            }
          })
          if(!isBreak){
            //正则匹配任然匹配不到
            resolve(null);
          }
        } else {
          //不存在任何正则
          resolve(null);
        }
      });
    });
  })
};

