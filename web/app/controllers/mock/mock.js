/**
 * Created by Leo on 16/8/4.
 */
var Log = require('../../models/Log');
var Road = require('../../models/Road');
var Conn = require('../../models/conn');
var R = require('request');
var Config = require('../../../../config');
module.exports.mock = function* mock() {
	//查询次数模拟
	for (var i = 8; i < 200; i++) {
		var slack_userids = ['U1X33LV2Q', 'U1WQGAES1'];

		var slack_userid = slack_userids[i % 2];
		var day = parseInt(Math.random() * 10) % 5 + 1;


		var createdAt = `2016-08-${day} 10:11:00`;

		var mockData = {
			slack_userid: slack_userid,
			question: 'test question',
			answer: 'test answer',
			createdAt: createdAt,
			updatedAt: createdAt
		};

		Log.create(mockData);
	}
	this.body = {
		success: true
	}

};

function roadMockBuild(city, from, to, slack_userid, createdAt ){
	var qs = {
		ak: Config.bmap.ak,
		output: 'json',
		origin: from,
		destination: to,
		mode: 'driving',
		region: city,
		origin_region: city,
		destination_region: city
	};

	return new Promise((resolve, reject) => {
		R(
			{
				url: 'http://api.map.baidu.com/direction/v1',
				qs: qs,
				json:true
			},
			function (error, response, res) {
				try {
					if (error || response.statusCode != 200 || res.status != 0) {
						console.log({
							error: true,
							errorMessage: '抓取路径失败'
						});
						throw new Error();
					}
					if(!res.result.routes || !res.result.routes[0]){
						throw new Error();
					}
				}catch (e){
					resolve();
					console.log(from + '~' + to + '抓取失败');
					return;
				}


				var allRoutePois = [];
				res.result.routes[0] && res.result.routes[0].steps.forEach((step) => {
					allRoutePois = allRoutePois.concat(step.path.split(';'));
				});

				res.result.allRoutePois = allRoutePois;

				Road.create({
					slack_userid: slack_userid,
					road: JSON.stringify(res),
					createdAt: createdAt,
					updatedAt: createdAt
				}).then(() => {
					resolve({
						success: true
					})
				});
			}
		);
	});
}
module.exports.roadMock = function* roadMock() {
	yield function * (){
		return Conn.query('DELETE FROM roads');
	};

	var count= 0;
	var promises = [];
	var mokeDatas = [
		{
			locations: [
				'大陆汽车嘉定研发中心','上海迪士尼度假区','南京路步行街',
				'东方明珠','陆家嘴', '上海虹桥机场', '日月光中心瑞金区', '上海城隍庙', '豫园', '中华艺术宫',
				'外白渡桥', '新天地', '上海博物馆'
			],
			city: '上海',
			slack_userid: 'U1Y4PGFFB'
		},
		{
			locations: [
				'大陆汽车嘉定研发中心','上海迪士尼度假区','南京路步行街',
				'东方明珠','陆家嘴', '上海虹桥机场', '日月光中心瑞金区', '上海城隍庙', '豫园', '中华艺术宫',
				'外白渡桥', '新天地', '上海博物馆'
			],
			city: '上海',
			slack_userid: 'U1WQGAES1'
		},
		{
			locations: [
				'大陆汽车嘉定研发中心','上海迪士尼度假区','南京路步行街',
				'东方明珠','陆家嘴', '上海虹桥机场', '日月光中心瑞金区', '上海城隍庙', '豫园', '中华艺术宫',
				'外白渡桥', '新天地', '上海博物馆'
			],
			city: '上海',
			slack_userid: 'U1X33LV2Q'
		}
		// {
		// 	locations: [
		// 		'西湖风景区', '灵隐寺', '雷峰塔', '西溪湿地',
		// 		'三潭印月', '千岛湖', '杭州宋城', '岳王庙',
		// 		'孤山', '大明山景区', '西泠印社', '六和塔'
		// 	],
		// 	city: '杭州',
		// 	slack_userid: 'U1X33LV2Q'
		// },
		// {
		// 	locations: [
		// 		'锦里', '成都大熊猫繁育研究基地', '都江堰景区', '武侯祠',
		// 		'杜甫草堂', '青城山', '金沙遗址博物馆', '春熙路街道',
		// 		'文殊院', '人民公园', '欢乐谷', '西岭雪山'
		// 	],
		// 	city: '成都',
		// 	slack_userid: 'U1WQGAES1'
		// }
	];
	mokeDatas.forEach(( mokeData, index) => {
		var i = index + 1;
		var locations = mokeData.locations;
		var city = mokeData.city;
		var slack_userid = mokeData.slack_userid;
		var sumPer = (locations.length - (locations.length % 3)) / 3;


		for (var j = 1 ; j < 3; j++){
			for(var k = (j-1) *sumPer; k < sumPer * j; k++){
				var date = '2016-08-0'+(i+1)+' 18:00:47';
				promises.push(roadMockBuild(city, locations[k], locations[k+1], slack_userid, date));
			}
		}

	});
	console.log(count);
	yield function *(){
		return Promise.all(promises);
	};

	this.body = {
		success: true
	}
};


