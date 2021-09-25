const { Schema, model } = require('mongoose');

module.exports = model(
	'Result',
	new Schema({
		testType: { type: String, required: true, enum: ['Dislexia', 'Discalculia'] },
		date: { type: Date, required: true, default: Date.now },
		finished: { type: Boolean, default: false, required: true },
		answers: { type: Object, default: {}, required: true },
	})
);
