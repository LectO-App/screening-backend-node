const { Schema, model } = require('mongoose');

module.exports = model(
	'Answer',
	new Schema({
		userId: {type: String, ref: 'User', required: true},
		studentId: {type: String, ref: 'Student', required: true},

		testType: { type: String, required: true, enum: ['Dislexia', 'Discalculia'] },
		questionName: { type: String, required: true },
		populationGroup: { type: String, required: true, },

		score: {type: Number, required: true },
	})
);