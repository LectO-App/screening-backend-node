const { Schema, model } = require('mongoose');

module.exports = model(
	'Result',
	new Schema({
		userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
		studentId: {type: Schema.Types.ObjectId, ref: 'Student', required: true},
		
		testType: { type: String, required: true, enum: ['Dislexia', 'Discalculia'] },
		date: { type: Date, required: true, default: Date.now },
		finished: { type: Boolean, default: false, required: true },
		answers: { type: Object, default: {}, required: true },
	})
);
