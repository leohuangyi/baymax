/**
 * Created by Leo on 16/8/5.
 */
define(function (require, module, exports) {
	$('#logout').on('click', () => {
		localStorage.removeItem('userinfo');
		window.location.href = '/';
	});

	const pathname = window.location.pathname;
	$('.menu-list .menu-item a')
		.remove('active')
		.filter(`[href="${[pathname]}"]`).addClass('active');
});

