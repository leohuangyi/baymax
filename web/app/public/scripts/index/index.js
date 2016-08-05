/**
 * Created by Leo on 16/8/1.
 */
define(function (require, exports, module) {
	var notify = require('../common/utils').notify();

	const userinfo = localStorage.getItem('userinfo');
	if (userinfo) {
		window.location.href = '/list';
	}

	const $licenseNode = $('#license');
	const $passwordNode = $('#password');

	function login() {
		const license = $licenseNode.val();
		const password = $passwordNode.val();

		if (validate({license, password})) {
			$.post('api/login', {
				license,
				password,
			})
				.done(response => {
					if (response.errorMessage) {
						notify(response.errorMessage, 'negative', 2000);
					} else {
						localStorage.setItem('userinfo', JSON.stringify(response));
						notify('登录成功', 'success', 2000);
						window.location.href = '/dashboard';
					}
				})
				.fail(response => {
					console.log(`fail: ${response}`);
				});
		}
	}

	function validate({license, password}) {
		if (!license) {
			notify('车牌号不能为空', 'negative', 2000);
			return false;
		}
		if (!password) {
			notify('密码不能为空', 'negative', 2000);
			return false;
		}
		return true;
	}

	$('#submit').on('click', login);

	function enterLogin(e) {
		var e = window.event || e;
		const isInputFocus = $("input[type=text], input[type=password]").is(':focus')
		const keyCode = e.keyCode;
		if (keyCode == 13 && isInputFocus) {
			login();
		}
	}
	$('.login-container').on('keydown', enterLogin);
});
