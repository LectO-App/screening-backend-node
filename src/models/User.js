const { model, Schema } = require('mongoose');

module.exports = model(
	'User',
	new Schema({
		email: { type: String, unique: true },
		password: { type: String, required: true },
		name: { type: String, required: true },
		verified: { type: Boolean, required: true, default: false },
		takenTests: { type: Number, default: 0, required: true },
		students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
		registrationDate: { type: Date },
		verificationDate: { type: Date },
	})
);
