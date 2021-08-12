const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.signToken = function (email) {
	return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '3h' });
};

module.exports.signEmail = function (email) {
	return jwt.sign({ email }, process.env.JWT_EMAIL_SECRET, { expiresIn: '24h' });
};

module.exports.verifyTokenAndGetUser = async function (token, res, options) {
	try {
		const { email } = await jwt.verify(token, process.env.JWT_SECRET);
		if (options?.populate) {
			const user = await User.findOne({ email }).populate(options.populate);
			return user;
		} else {
			const user = await User.findOne({ email });
			return user;
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ status: 'Invalid token' });
		return 'Error';
	}
};

module.exports.verifyEmail = async function (token) {
	try {
		const email = await jwt.verify(token, process.env.JWT_EMAIL_SECRET);
		return email;
	} catch (error) {
		return 'Error';
	}
};
