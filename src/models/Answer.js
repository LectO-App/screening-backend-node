const { Schema, model } = require('mongoose');

module.exports = model(
	'Answer',
	new Schema({
		userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
		studentId: {type: Schema.Types.ObjectId, ref: 'Student', required: true},
		testId: {type: Schema.Types.ObjectId, ref: 'Result', required: true},

		testType: { type: String, required: true, enum: ['Dislexia', 'Discalculia'] },
		questionName: { type: String, required: true },

		province: { type: String, required: true },
		locality: { type: String, required: true },
		schoolType: { type: String, required: true },
		genre: { type: String, required: true },
		schoolYear: {type: Number, required: true},
		previousDiagnostic: {type: Boolean, required: true},

		score: {type: Number, required: true },
	})
);