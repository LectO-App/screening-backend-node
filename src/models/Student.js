const { Schema, model } = require('mongoose');

module.exports = model(
	'Student',
	new Schema({
		alias: { type: String, required: true },
		province: { type: String, required: true },
		locality: { type: String, required: true },
		birth: { type: Object, required: true },
		schoolType: { type: String, required: true },
		genre: { type: String, required: true },
		hand: { type: String },
		parentsLevel: { type: String },
		results: [{ type: Schema.Types.ObjectId, ref: 'Result' }],
	})
);
