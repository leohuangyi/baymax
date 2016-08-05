/**
 * Created by Leo on 16/8/3.
 */
define(function (require, module, exports) {
	var Utils = require('build/js/common/utils');
	var Notify = Utils.notify;
	var UserData = Utils.loginRequire();
	// 车牌号
	$('#license').text('当前车:' + UserData.license_plate);
	//本人查询次数表
	$.ajax({
		url: '/api/count-day',
		dataType: 'json',
		data: {
			license_plate: UserData.license_plate
		}
	}).then((res) => {
		if (res.error) {
			Notify(res.errorMessage, 'negative', 2000);
		}

		buildQueryChart('user-query-chart', Object.assign({
			title: '本用户Baymax日响应次数统计'
		}, res.data.userDatas));
		buildQueryChart('all-query-chart', Object.assign({
			title: '所有用户Baymax日响应次数统计'
		}, res.data.allDatas));
	});

	//构建路线地图
	$.ajax({
		url: '/api/road',
		data: {
			slack_userid: 'U1WQGAES1',
			date: '2016-08-04'
		},
		dataType: 'json'
	}).then(function (data) {

		buildMapChart('map-chart', data);

	});


	function buildQueryChart(nodeId, data) {
		//构造近7日数据请求响应图
		if ($('#' + nodeId).length < 1) {
			throw new Error('找不到Echart容器');
		}
		if (!data.x || !data.y) {
			throw new Error('构造Echart数据不符合规范');
		}

		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById(nodeId));

		// 指定图表的配置项和数据
		var option = {
			tooltip: {
				trigger: 'axis',
				position: function (pt) {
					return [pt[0], '10%'];
				}
			},
			title: {
				left: 'center',
				text: data.title,
			},
			legend: {
				top: 'bottom',
				data: ['意向']
			},
			toolbox: {
				feature: {
					dataZoom: {
						yAxisIndex: 'none'
					},
					restore: {},
					saveAsImage: {}
				}
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: data.x
			},
			yAxis: {
				type: 'value',
				max: 'dataMax',
				boundaryGap: [0, '100%']
			},

			series: [
				{
					name: '响应次数',
					type: 'line',
					smooth: false,
					symbol: 'none',
					sampling: 'average',
					itemStyle: {
						normal: {
							color: 'rgb(255, 70, 131)'
						}
					},
					areaStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
								offset: 0,
								color: 'rgb(255, 158, 68)'
							}, {
								offset: 1,
								color: 'rgb(255, 70, 131)'
							}])
						}
					},
					data: data.y
				}
			]
		};

		// 使用刚指定的配置项和数据显示图表
		myChart.setOption(option);
	}

	function buildMapChart(nodeId, data) {
		if ($('#' + nodeId).length < 1) {
			throw new Error('找不到Echart容器');
		}
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById(nodeId));


		var convertData = function (data, from, to) {
			var res = [];


			res.push({
				fromName: from,
				toName: to,
				coords: data.map((poi) => {
					return poi.split(',');
				})
			});
			return res;
		};

		var color = ['#a6c84c', '#ffa022', '#46bee9'];
		var series = [];

		data.roads.forEach((road, index) => {
			series.push(
				{
					name: '',
					type: 'lines',
					coordinateSystem: 'geo',
					zlevel: 1,
					effect: {
						show: true,
						period: 6,
						trailLength: 0.7,
						color: '#fff'
					},
					polyline: true,
					lineStyle: {
						normal: {
							color: color[0],
							width: 0
						}
					},
					data: convertData(road.pois, road.from, road.to)
				},
				{
					name: '',
					type: 'lines',
					coordinateSystem: 'geo',
					zlevel: 1,
					polyline: true,
					lineStyle: {
						normal: {
							color: color[1],
							width: 1,
							opacity: 0.3
						}
					},
					data: convertData(road.pois, road.from, road.to)
				}
			);
		});


		var option = {
			backgroundColor: '#404a59',
			title: {
				top: '20px',
				text: '近3日汽车行驶轨迹图.上海市',
				left: '20px',
				textStyle: {
					color: '#fff'
				}
			},
			tooltip: {
				trigger: 'item'
			},
			geo: {
				center: [121.47535,31.234082],
				roam: true,
				zoom: 4,
				map: '上海',
				label: {
					emphasis: {
						show: true
					}
				},
				itemStyle: {
					normal: {
						areaColor: '#323c48',
						borderColor: '#111'
					},
					emphasis: {
						areaColor: '#ccc'
					}
				}
			},

			series: series
		};

		myChart.setOption(option);

	}

})
;
