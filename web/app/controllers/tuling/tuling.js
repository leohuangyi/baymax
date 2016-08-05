/**
 * Created by Leo on 2016/8/2.
 */
const R = require('request');
const Url = require('url');
const Config = require('../../../../config.js');
module.exports.Q = function *( message, loc ){
    var param = {
        key: Config.tuling.key,
        info: message.text,
        userid: message.user,
        loc: loc
    };
    return new Promise((resolve, reject) => {
        R.post(
            {
                url: 'http://www.tuling123.com/openapi/api',
                form: param,
                json: true
            },
            function (err, httpResponse, body) {
                if (err) {
                    reject(err);
                }
                resolve(body);
            }
        )
    }).then( (tulingRes) => {
        var res = {
            type: 'text',
            data: {

            }
        };
        switch (tulingRes.code){
            case 100000:
                res.data.text = tulingRes.text;
                return res;
            case 40004:
                res.data.text = '你的宝宝已经耗尽今日电量，暂时无法继续回答，请明日再试';
                return res;
            case 200000:
                res.type = 'link';
                res.data.text = tulingRes.text;
                res.data.link = tulingRes.url;
                return res;
            default:
                res.data.text = '呀，什么都没发生呢';
                return res;
        }
    });
}

function urlIsImg(url){
    const urlPath = Url.parse(url).pathname.toLowerCase();
    var urlIsImg = false;
    [
        'jpg',
        'jepg',
        'gif',
        'png',
        'bmp'
    ].forEach((ext) => {
        if(urlPath.indexOf(ext) !== -1){
            urlIsImg = true;
        }
    });
    return urlIsImg;
}
