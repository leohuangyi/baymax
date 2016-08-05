'use strict';
const messages = require('./controllers/messages');
const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const route = require('koa-route');
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const app = module.exports = koa();
const Init = require('./controllers/init');
const Test = require('./controllers/test');
const Login = require('./controllers/login');
const SlackMes = require('./controllers/slack/message')
const Count = require('./controllers/api/count');
const Dashboard = require('./controllers/dashboard');

const Mock = require('./controllers/mock/mock');
const RoadApi = require('./controllers/api/road');

const Questions = require('./controllers/api/questions');

// Logger
app.use(logger());
app.use(bodyParser());


app.use(route.get('/test', Test.test)); //数据插入测试,可以删除
app.use(route.get('/', messages.login));
app.use(route.get('/list', messages.list));
app.use(route.get('/dashboard', Dashboard.dashboard ));

app.use(route.post('/slack/message', SlackMes.message));
app.use(route.post('/api/login', Login.login));
app.use(route.post('/api/question', Questions.saveQuestion)); // 增加和更新问题
app.use(route.post('/api/question-d', Questions.deleteQuestion)); // 删除问题
app.use(route.get('/api/count', Count.count));	//根据车牌获取用户请求信息
app.use(route.get('/api/count-day', Count.countDay));	//根据车牌获取用户请求信息

app.use(route.get('/api/road', RoadApi.road));
//app.use(route.get('/mock-count', Mock.mock));	//创造虚拟响应数据
//app.use(route.get('/mock-road', Mock.roadMock)); //创建虚拟路径数据
app.use(route.get('/api/questions', Questions.getQuestions)); // 获取用户问题

// Serve static files
app.use(serve(path.join(__dirname, 'public')));

// Compress
app.use(compress());

new Promise((resove) => {
  //数据库初始化(表不存在则新建)
  Init.init().then((res) => {
    console.log(res);
    resove(res);
  })
}).then((res) => {
  if (!module.parent) {
    app.listen(3000);
    console.log('网站监听端口: 3000');
  }
});


