/**
 * Created by Leo on 16/8/3.
 */
'use strict';
const views = require('co-views');

const render = views(__dirname + '/../views', {
	map: { html: 'swig' }
});

module.exports.dashboard = function *dashboard(ctx) {
	this.body = yield render('dashboard');
};


