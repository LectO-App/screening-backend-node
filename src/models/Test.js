const { model, Schema } = require('mongoose');

module.exports = model(
	'Test',
	new Schema({
		questions: { type: Array, required: true },
	})
);
