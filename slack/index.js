/**
 * Created by Leo on 16/8/1.
 */
const R = require('request');
const RtmClient = require('@slack/client').RtmClient;
//const WebClient = require('@slack/client').WebClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const Config = require('../config');
const rtm_token = Config.slack.rtm_token;
//const web_token = Config.slack.web_token;

const Rtm = new RtmClient(rtm_token, {logLevel: 'error'});
//const Web = new WebClient(web_token, {logLevel: 'error'});

Rtm.start();

Rtm.on(RTM_EVENTS.MESSAGE, function (message) {
  // Listens to all `message` events from the team
  if (message.type === 'message') {
    console.log(message);
    new Promise((resolve, reject) => {
      R.post(
        {
          url: 'http://localhost:3000/slack/message',
          form: message,
          json: true
        },
        function (err, httpResponse, body) {
          if (err) {
            console.log(err);
            reject(err);
          }
          resolve(body);
        })
    }).then((res) => {
      var data = res.data;
      switch (res.type){
        case 'text': {
          Rtm.sendMessage(data.text, data.channel);
          break;
        }
        case 'link': {
          Rtm.sendMessage(
            data.text + '\n' + data.link,
            data.channel
          );
          break;
        };
      }
    });
  }
});
