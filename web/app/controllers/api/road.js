/**
 * Created by Leo on 16/8/4.
 */
const Road = require('../../models/Road');
const Conn = require('../../models/conn');
module.exports.road = function*() {
	var slack_userid = this.request.query.slack_userid;
	var date = this.request.query.date;
	if (!slack_userid || !date) {
		this.body = {
			error: true,
			errorMessage: '参数非法'
		}
		return false;
	}
	var resBody = {
		roads: []
	};
	yield function*() {
		return new Promise((resolve, reject) => {

			Conn.query(`SELECT * FROM roads WHERE slack_userid = '${slack_userid}'`)
				.spread((rows, meteData) => {

					rows.forEach((row) => {
						var bmapRes = {};
						try{
							bmapRes = JSON.parse(row.road);
						}catch(e){
							return ;
						}


						resBody.roads.push({
							pois: bmapRes.result.allRoutePois,
							distance: bmapRes.result.routes[0].distance,
							from: bmapRes.result.origin.wd,
							to: bmapRes.result.destination.wd
						});
					});

					resolve(resBody);
				});
		});
	}
	this.body = resBody;
};
