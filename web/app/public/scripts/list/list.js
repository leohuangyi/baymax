/**
 * Created by Leo on 16/8/3.
 */
define(function (require, module, exports) {
	var userinfo = localStorage.getItem('userinfo');
	userinfo = userinfo && JSON.parse(userinfo);
	if (!userinfo) {
		window.location.href = '/'
	}

	const Util = require('../common/utils');
	Util.loginRequire();
	const notify = Util.notify();

	$('.ui.radio.checkbox')
		.checkbox();

	const $listTable = $('#list-table');
	const $tbody = $('#list-table tbody');
	const $form = $('.form-container');
	const $question = $('#question');
	const $answer = $('#answer');
	const $deleteBtn = $('.deleteBtn');

	var table;
	var currentObj = null;

	// 车牌号
	$('#license').text('当前车:' + userinfo.license_plate);

	getQuestions();
	function getQuestions() {
		$.get(`/api/questions?id=${userinfo.id}`)
			.done((response) => {
				if (!response) return;
				table = renderTable(response)
			});
	}

	function renderTable(data) {
		(data || []).forEach(item => {
			item.typeName = item.type == 1 ? '普通模式' : '正则模式';
			item.attrName = item.car_id ? '私有' : '公有';
		});
		var table =  $listTable.DataTable({
			data: data,
			bDestroy: true,
			language: {
				"sProcessing":   "处理中...",
				"sLengthMenu":   "显示 _MENU_ 项结果",
				"sZeroRecords":  "没有匹配结果",
				"sInfo":         "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
				"sInfoEmpty":    "显示第 0 至 0 项结果，共 0 项",
				"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
				"sInfoPostFix":  "",
				"sSearch":       "搜索:",
				"sUrl":          "",
				"sEmptyTable":     "表中数据为空",
				"sLoadingRecords": "载入中...",
				"sInfoThousands":  ",",
				"oPaginate": {
					"sFirst":    "首页",
					"sPrevious": "上页",
					"sNext":     "下页",
					"sLast":     "末页"
				},
				"oAria": {
					"sSortAscending":  ": 以升序排列此列",
					"sSortDescending": ": 以降序排列此列"
				}
			},
			columns: [
				{ "data": "id" },
				{ "data": "answer" },
				{ "data": "question" },
				{ "data": "typeName" },
				{ "data": "attrName"},
				{ "data": "createdAt" },
				{ "data": "updatedAt" },
				{ "data": 'btns'}
        	]
		});
		onTrClick(table);
		return table;
	}

	$('.createObj').on('click', () => {
		$form.removeClass('hide');
		$deleteBtn.addClass('hide');
		currentObj = {};
		setFormValue(currentObj);
	});

	function onTrClick(table) {
		$tbody.on('click', 'tr', function() {
			var tr = $(this);

			const row = table.row(tr);
			currentObj = row.data();

			if (!currentObj.car_id) return;

			table.$('tr.active').removeClass('active');
			tr.addClass('active');
			$form.removeClass('hide');
			$deleteBtn.removeClass('hide');
			setFormValue(currentObj)
		});
	}

	// 给问题表单赋值
	function setFormValue(obj) {
		obj.type = obj.type || 1;
		$(`.radio-input[value=${obj.type}]`)[0].checked = true;
		$question.val(obj.question);
		$answer.val(obj.answer);
	}

	$('.radio-input').on('click', (e) => {
		currentObj.type = parseInt($(e.target).val());
		currentObj.typeName = currentObj.type === 1 ?
			'普通模式' : '正则模式';
	});

	$('.cancelBtn').on('click', () => {
		$form.addClass('hide');
		$tbody.find('tr').removeClass('active');
		currentObj = {};
		setFormValue(currentObj);
	});

	$('.saveBtn').on('click', () => {
		if (!validate()) return;
		currentObj.car_id = parseInt(userinfo.id);
		currentObj.question = $question.val();
		currentObj.answer = $answer.val();

		$.post('/api/question',
			currentObj
		)
			.done(() => {
				$form.addClass('hide');
				$listTable.remove();
				getQuestions();
				notify('保存成功', 'success', 2000)
			})
			.fail(() => {
				notify('保存失败', 'negative', 2000);
			})
	});

	$deleteBtn.on('click', () => {
		$.post('/api/question-d', {
			id: currentObj.id
		})
			.done(() => {
				$form.addClass('hide');
				$listTable.remove();
				getQuestions();
				notify('删除成功', 'success', 2000)
			})
	});

	function validate() {
		if (!$question.val()) {
			notify('问题不能为空', 'negative', 2000);
			return false;
		}
		if (!$answer.val()) {
			notify('答案不能为空', 'negative', 2000);
			return false;
		}
		return true;
	}

});

