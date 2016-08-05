'use strict';
const views = require('co-views');
const parse = require('co-body');
const messages = [
  { id: 0,
    message: 'Koa next generation web framework for node.js'
  },
  { id: 1,
    message: 'Koa is a new web framework designed by the team behind Express'
  }
];

const render = views(__dirname + '/../views', {
  map: { html: 'swig' }
});

module.exports.login = function *login(ctx) {
  this.body = yield render('login');
};

module.exports.list = function *list() {
  this.body = yield render('list');
};

