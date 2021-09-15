const { Schema, model } = require('mongoose');

module.exports = model(
	'Student',
	new Schema({
		alias: { type: String, required: true },
		province: { type: String, required: true },
		locality: { type: String, required: true },
		birth: { type: Date, required: true },
		schoolType: { type: String, required: true },
		genre: { type: String, required: true },
		isSpanish: {type: Boolean, required: true},
		schoolYear: {type: Number, required: true},
		previousDiagnostic: {type: Boolean, required: true},
		previousDiagnostcDetails: {type: String },
		hand: { type: String },
		parentsLevel: { type: String },
		results: [{ type: Schema.Types.ObjectId, ref: 'Result' }],
	})
);