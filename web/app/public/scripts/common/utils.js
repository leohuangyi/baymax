/**
 * Created by Leo on 16/8/3.
 */
define(function (require, exports, module) {
	module.exports.notify = function () {
		var notifTimeOut = null;
		return function(message, type, time){
			var time = time || 1000;
			clearNotify();
			show();

			function clearNotify() {
				var notifNode = $('body > .notif');
				if (notifNode.length > 0) {
					notifNode.remove();
				}
				if (notifTimeOut) {
					clearInterval(notifTimeOut);
					notifTimeOut = null;
				}
			}
			function show() {
				var $notif = $(`
				<div class="notif">
					<div class="ui message">
						<strong class="notif-message"></strong>
					</div>
				</div>
			  `).appendTo($('body'));
				$notif.find('.notif-message').empty().append(message || '消息');
				$notif.find('.message').removeClass('negative success').addClass(type)
					.end().addClass('active');

				notifTimeOut = setTimeout(function(){
					clearNotify();
				}, time)
			}
		};
	}
	module.exports.loginRequire = function(){
		var user = window.localStorage.getItem('userinfo');
		try{


			if(!user || !JSON.parse(user)){
				throw new Error('尚未登录');
			}
		}catch (e){
			window.location.href = '/'
		}

		return JSON.parse(user);
	};
});
