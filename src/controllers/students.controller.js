const { verifyTokenAndGetUser, verifyToken } = require('../auth/tokenManager');

const User = require('../models/User');
const Student = require('../models/Student');

const getResults = require('../utils/getResults');

const studentsController = {};

studentsController.createStudent = async (req, res) => {
	const { token, student } = req.body;
	const user = await verifyTokenAndGetUser(token, res);

	if (user === 'Error') res.status(401).json;

	try {
		const studentDb = await Student.create(student);
		user.students.push(studentDb._id);
	} catch (e) {

	}

	await user.save();

	res.json({ status: 'Correctly created student' });
};

studentsController.deleteStudent = async (req, res) => {
	const { token, student } = req.body;
	const user = await verifyTokenAndGetUser(token, res);

	// eslint-disable-next-line
	if (!student.hasOwnProperty('id')) {
		res.status(400).json({ status: 'For delete, student must have an id' });
		return;
	}

	const { id } = student;

	if (!user.students.includes(id)) {
		res.status(400).json({ status: 'This student is not from this user.' });
		return;
	}

	await Student.deleteOne({ _id: id });
	user.students.splice(user.students.indexOf(id), 1);
	await user.save();

	res.json({ status: 'Correctly deleted user' });
};

studentsController.modifyStudent = async (req, res) => {
	const { token, student } = req.body;
	const user = await verifyTokenAndGetUser(token, res);

	if (user === 'Error') return;
	// eslint-disable-next-line
	if (!(student.hasOwnProperty('name') && student.hasOwnProperty('surname') && student.hasOwnProperty('id'))) {
		res.status(400).json({ status: 'For update, student must have a name, surname and id' });
		return;
	}

	const { name, surname, id, birthdate } = student;

	if (!user.students.includes(id)) {
		res.status(400).json({ status: 'This student is not from this user.' });
		return;
	}

	await Student.updateOne({ _id: id }, { name, surname, birthdate: new Date(birthdate) });
	res.json({ status: 'Correctly updated student' });
};

studentsController.getStudentById = async (req, res) => {
	const { token, studentId } = req.body;
	const user = await verifyTokenAndGetUser(token, res);

	if (user === 'Error') return;
	
	if (!user.students.includes(studentId)) {
		res.status(400).json({ status: 'This patient is not from this user.' });
		return;
	}

	const student = await Student.findOne({ _id: studentId }).populate('results');
	const results = await getResults(student.results || []);

	res.json({ student, results });
};

studentsController.getAllUserStudents = async (req, res) => {
	const { token } = req.body;
	const user = await verifyTokenAndGetUser(token, res, { populate: 'students' });

	if (user === 'Error') return;

	res.json(user.students);
};

module.exports = studentsController;
