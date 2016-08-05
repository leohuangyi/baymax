/**
 * Created by haibo on 16/8/4.
 */
const Question = require('../../models/Questions');
const Moment = require('moment');

const getQuestions = function* () {
	const carId = this.request.query.id;
	this.body = yield new Promise((resolve, reject) => {
		Question.findAll({
			where: {
				$or: [{
					car_id: [0, parseInt(carId)]
				}]
			}
		}).then((questions) => {
			if (!questions) {
				resolve(null)
			}
			resolve(questions.map(question => {
				return {
					id: question.id,
					car_id: question.car_id,
					question: question.question,
					answer: question.answer,
					type: question.type,
					createdAt: Moment(question.createdAt).format("YYYY-MM-DD"),
					updatedAt: Moment(question.updatedAt).format("YYYY-MM-DD"),
					btns: question.car_id != 0 ? `
						<button class="ui icon button tiny green">
  							<i class="edit icon"></i>
						</button>
					` : ''
				};
			}))
		})
	})
};

const saveQuestion = function* () {
	const body = this.request.body;
	this.body = yield new Promise((resolve, reject) => {
		const id = body.id;
		const params = {
			car_id: body.car_id,
			question: body.question,
			answer: body.answer,
			type: body.type
		}
		try {
			if (id) {
				params.id = id;
				Question.update(params, {
					where: {
						id: id,
					}
				})
					.then(data => {
						resolve({message: 'ok'})
					})
			} else {
				Question.create(params)
					.then(data => {
						resolve({message: 'ok'})
					})
			}
		} catch(error) {
			throw(error);
			reject(null);
		}
	})
};

const deleteQuestion = function* () {
	const body = this.request.body;
	this.body = yield new Promise((resolve, reject) => {
		Question.destroy({
			where: {
				id: body.id,
			}
		}).then((data) => {
			resolve({message: 'ok'});
		})
	})
};

module.exports = {
	getQuestions: getQuestions,
	saveQuestion: saveQuestion,
	deleteQuestion: deleteQuestion,
}
