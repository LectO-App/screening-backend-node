const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.signToken = function (email) {
	return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '3h' });
};

module.exports.signEmail = function (email) {
	return jwt.sign({ email }, process.env.JWT_EMAIL_SECRET, { expiresIn: '24h' });
};

module.exports.signRestorePassword = function (email) {
	return jwt.sign({ email }, process.env.JWT_RESTORE_PASSWORD_SECRET, { expiresIn: '2h' });
};


module.exports.verifyToken = async function (token) {
    try {
        const email = await jwt.verify(token, process.env.JWT_SECRET);
        return email;
    } catch (error) {
        return "Error";
    }
}

module.exports.verifyTokenAndGetUser = async function (token, res, options = {}) {
	try {
		const { email } = await jwt.verify(token, process.env.JWT_SECRET);
		if ('populate' in options) {
			const user = await User.findOne({ email }).populate(options.populate, "_id alias");
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

module.exports.verifyEmail = async function (token, res) {
	try {
		const { email } = await jwt.verify(token, process.env.JWT_EMAIL_SECRET);
		const user = await User.findOne({ email });
		return user;
	} catch (error) {
		console.log(error);
		res.status(400).json({ status: 'Invalid token' });
		return 'Error';
	}
};

module.exports.verifyRestorePassword = async function (token, res) {
	try {
		const { email } = await jwt.verify(token, process.env.JWT_RESTORE_PASSWORD_SECRET);
		const user = await User.findOne({ email });
		return user;
	} catch (error) {
		console.log(error);
		res.status(400).json({ status: 'Invalid token' });
		return 'Error';
	}
};
