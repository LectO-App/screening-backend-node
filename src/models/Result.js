const { Schema, model } = require('mongoose');

module.exports = model(
	'Result',
	new Schema({
		test: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
		date: { type: Date, required: true, default: Date.now },
		finished: { type: Boolean, default: false },
		answers: [{ type: Object }],
	})
);
