const bcrypt = require('bcryptjs');

const { verifyTokenAndGetUser, signToken } = require('../auth/tokenManager');

const User = require('../models/User');

const sendEmail = require('../utils/sendEmail');

const usersController = {};

const regexp =
	/* eslint-disable-next-line */
	/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const inputValidation = input => {
	if (!(input.password && input.password.length >= 8))
		return 'Error en la contraseña. La contraseña debe tener 8 o más caracteres.';

	if (!(input.name && typeof input.name === 'string')) return 'Error en el nombre.';

	if (!(input.email && typeof input.name === 'string' && input.email.match(regexp)))
		return 'Error en el correcto electrónico. El correo electrónico debe tener caracteres válidos.';

	return 'OK';
};

usersController.signIn = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		res.status(400).json({ status: 'User does not exist.' });
		return;
	}

	const correct = await bcrypt.compare(password, user.password);

	if (!correct) {
		res.status(400).json({ status: 'Incorrect password.' });
		return;
	}

	res.json({ token: signToken(email), verified: user.verified });
};

usersController.signUp = async (req, res) => {
	
	const input = {
		email: req.body.email,
		password: req.body.password,
		name: req.body.name,
	};

	const isValid = inputValidation(input);
	if (!(isValid === 'OK')) return res.status(400).json({ status: isValid });
	const users = await User.find({ email: input.email }).countDocuments();
	if (users > 0) return res.status(400).json({ status: 'Ya existe un usuario con ese correo electrónico.' });
	const hash = await bcrypt.hash(input.password, 8);

	await new User({
		email: input.email,
		password: hash,
		name: input.name,
		registrationDate: Date.now(),
	}).save();

	sendEmail(input.email);

	res.json({ verified: false, token: signToken(input.email) });
};

usersController.sendEmail = async (req, res) => {
	const { token } = req.body;
	const user = await verifyTokenAndGetUser(token, res);

	if (user.verified) return res.status(400).json({ status: 'Email already verified' });

	sendEmail(user.email, req.originalUrl);
	return res.json({ status: 'Verification email sent' });
};

usersController.getAllUsers = async (req, res) => {
	const allUsers = await User.find().populate('patients');
	return res.json(allUsers);
};

usersController.getUserById = async (req, res) => {
	const { token } = req.body;
	const user = await verifyTokenAndGetUser(token, res);

	return res.json(user);
};

usersController.verifyEmail = async (req, res) => {
	const { token } = req.body;
	const user = await verifyTokenAndGetUser(token, res);

	if (user.verified) return res.json({ status: 'Email already verified' });

	user.verified = true;
	user.verificationDate = Date.now();

	await user.save();

	res.json({ success: 'Email has been verified succesfully.', token: signToken(user.email) });
};

usersController.validateToken = async (req, res) => {
	const { token } = req.body;
	const user = await verifyTokenAndGetUser(token, res);

	return res.json({ token: signToken(user.email), verified: user.verified });
};

module.exports = usersController;
