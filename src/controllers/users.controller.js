const bcrypt = require('bcryptjs');
const { verifyTokenAndGetUser, signToken, verifyRestorePassword } = require('../auth/tokenManager');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const sendEmailRestore = require('../utils/sendEmailRestore');

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

	// #swagger.tags = ['Users']
	// #swagger.summary = 'Get a token for a certain user'

	const { email, password } = req.body;

	// swagger.parameters['email'] = {in: 'body', type: 'string', required: true}
	// swagger.parameters['password'] = {in: 'body', type: 'string', required: true}

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
	
	// #swagger.tags = ['Users']
	// #swagger.summary = 'Creates a new user'

	const input = {
		email: req.body.email,
		password: req.body.password,
		name: req.body.name,
	};

	// swagger.parameters['email'] = {in: 'body', type: 'string', required: true}
	// swagger.parameters['password'] = {in: 'body', type: 'string', required: true}
	// swagger.parameters['name'] = {in: 'body', type: 'string', required: true}

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

	/* #swagger.responses[200] = {
        description: 'Correct sign up',
        schema: {
			$verified: true,
			$token: 'token'
		}
	} */
};

usersController.sendEmail = async (req, res) => {

	// #swagger.tags = ['Users']
	// #swagger.summary = 'Sends a new verification email'

	const { token } = req.body;

	// swagger.parameters['email'] = {in: 'body', type: 'string', required: true}

	const user = await verifyTokenAndGetUser(token, res);
	if (user.verified) return res.status(400).json({ status: 'Email already verified' });

	sendEmail(user.email);
	return res.json({ status: 'Verification email sent' });

	/* #swagger.responses[200] = {
        description: 'Email sent',
        schema: {
			$status: 'Verification email sent',
		}
	} */
};

usersController.getUserById = async (req, res) => {

	// #swagger.tags = ['Users']
	// #swagger.summary = 'Retrieves user data'
	// #swagger.description = 'Given a user token, it retrieves users data'

	const { token } = req.body;

	// swagger.parameters['token'] = {in: 'body', type: 'string', required: true}

	const user = await verifyTokenAndGetUser(token, res);
	return res.json(user);

	/* #swagger.responses[200] = {
        description: 'Email sent',
        schema: {
			$status: 'Verification email sent',
		}
	} */
};

usersController.verifyEmail = async (req, res) => {
	
	// #swagger.tags = ['Users']
	// #swagger.summary = 'Verify your email'
	// #swagger.description = 'Given an email token, it lets you verify your account'

	const { token } = req.body;

	// swagger.parameters['token'] = {in: 'body', type: 'string', required: true}

	const user = await verifyEmail(token, res);

	if (user.verified) return res.json({ status: 'Email already verified' });

	user.verified = true;
	user.verificationDate = Date.now();

	await user.save();

	res.json({ success: 'Email has been verified succesfully.', token: signToken(user.email) });

	/* #swagger.responses[200] = {
        description: 'Email sent',
        schema: {
			$success: 'Email has been verified succesfully.',
			token: 'signedToken',
		}
	} */
};

usersController.sendRestorePassword = async (req, res) => {
	
	// #swagger.tags = ['Users']
	// #swagger.summary = 'Send email for password restoration'
	// #swagger.description = 'Given an email, it lets you send a password restore email'

	const { email } = req.body;
	// swagger.parameters['email'] = {in: 'body', type: 'string', required: true}
	try {

		const user = await User.findOne({ email });
		//if (!user.verified) throw new Error("Email not verified");
		sendEmailRestore(user.email);
	
		return res.json({ status: 'Restore password email sent' });

	} catch (error) {

		console.log(error);
		res.status(400).json({ status: 'Email does not exist or has not been verified' });

	}

	/* #swagger.responses[200] = {
        description: 'Email sent',
        schema: {
			$status: 'Restore password email sent',
		}
	} */
}

usersController.restorePassword = async (req, res) => {
	
	// #swagger.tags = ['Users']
	// #swagger.summary = 'Change password'
	// #swagger.description = 'Use an emailed token to change your password'

	const { token, password } = req.body;

	// swagger.parameters['token'] = {in: 'body', type: 'string', required: true}

	const user = await verifyRestorePassword(token, res);
	user.password = await bcrypt.hash(password, 8);
	await user.save();

	res.json({ success: 'Password has been changed succesfully.', token: signToken(user.email) });

	/* #swagger.responses[200] = {
        description: 'Password changed',
        schema: {
			$success: 'Password has been changed succesfully succesfully.',
			token: 'signedToken',
		}
	} */
};

usersController.validateToken = async (req, res) => {

	// #swagger.tags = ['Users']
	// #swagger.summary = 'Validate token'
	// #swagger.description = 'It gives you a new token. Works like a keep alive.'

	const { token } = req.body;
	// swagger.parameters['token'] = {in: 'body', type: 'string', required: true}
	const user = await verifyTokenAndGetUser(token, res);

	return res.json({ token: signToken(user.email), verified: user.verified });
	/* #swagger.responses[200] = {
        description: 'Email sent',
        schema: {
			$token: 'token',
			$verified: true,
		}
	} */
};

module.exports = usersController;
