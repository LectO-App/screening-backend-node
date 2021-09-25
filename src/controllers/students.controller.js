const { verifyTokenAndGetUser, verifyToken } = require('../auth/tokenManager');

const User = require('../models/User');
const Student = require('../models/Student');

const studentsController = {};

studentsController.createStudent = async (req, res) => {

	// #swagger.tags = ['Students']
	// #swagger.summary = 'Create new student'
	// #swagger.description = 'This lets you create a new student for a certain user'

	const { token, student } = req.body;
	const user = await verifyTokenAndGetUser(token, res);

	/*  #swagger.parameters['body'] = {
		in: 'body',
		description: 'User to create',
		schema: {
			$token: 'token',
			$student: {
				$alias: 'Nombre',
				$province: 'CABA',
				$locality: 'CABA',
				$birth: '2020-01-01',
				$schoolType: ['Privada', 'Publica'],
				$genre: ['Masculino', 'Femenino', 'Otro'],
				$isSpanish: ['true', 'false'],
				$schoolYear: [0, 1, 2, 3],
				$previousDiagnostic: [true, false],
				$previousDiagnostcDetails: 'Si la respuesta anterior fue true',
				hand: ['Diestro','Zurdo'],
				parentsLevel: 'Universitario',
			}
		}
	} */

	try {
		const studentDb = await Student.create(student);
		user.students.push(studentDb._id);
	} catch (error) {
		console.log(error);
		res.status(400).json({ status: 'An error occured creting the student', error });
	}

	await user.save();
	res.json({ status: 'Correctly created student' });

	/* #swagger.responses[200] = {
		description: 'Correcly created student',
		schema: {
			$status: 'Correctly created student',
		}
	} */
};

studentsController.deleteStudent = async (req, res) => {

	// #swagger.tags = ['Students']
	// #swagger.summary = 'Deletes an existing student'
	// #swagger.description = 'This lets you delete a student for a certain user'

	const { token, student } = req.body;
	const user = await verifyTokenAndGetUser(token, res);

	/*  #swagger.parameters['body'] = {
		in: 'body',
		description: 'User to delete',
		schema: {
			$token: 'token',
			$student: {
				$id: 'studentId',
			}
		}
	} */

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

	res.json({ status: 'Correctly deleted student' });

	/* #swagger.responses[200] = {
		description: 'Correcly deleted student',
		schema: {
			$status: 'Correctly deleted student',
		}
	} */
};

studentsController.modifyStudent = async (req, res) => {
	// #swagger.tags = ['Students']
	// #swagger.summary = 'Modifies an existing student'
	// #swagger.description = 'This lets you modify a student for a certain user'

	const { token, student } = req.body;
	const user = await verifyTokenAndGetUser(token, res);

	/*  #swagger.parameters['body'] = {
		in: 'body',
		description: 'User to modify',
		schema: {
			$token: 'token',
			$student: {
				$id: 'studentId',
				alias: 'Nombre',
				province: 'CABA',
				locality: 'CABA',
				birth: '2020-01-01',
				schoolType: ['Privada', 'Publica'],
				genre: ['Masculino', 'Femenino', 'Otro'],
				isSpanish: ['true', 'false'],
				schoolYear: [0, 1, 2, 3],
				previousDiagnostic: [true, false],
				previousDiagnostcDetails: 'Si la respuesta anterior fue true',
				hand: ['Diestro','Zurdo'],
				parentsLevel: 'Universitario',
			}
		}
	} */

	if (user === 'Error') return;

	if (!student.hasOwnProperty('id')) {
		res.status(400).json({ status: 'For update, student must have a name, surname and id' });
		return;
	}

	const id = student.id;

	if (!user.students.includes(id)) {
		res.status(400).json({ status: 'This student is not from this user.' });
		return;
	}
	try {

		for (const [key, value] of Object.entries(student)) {
			if (!value) {
				delete student[key];
			} else if (key === "birth") {
				student.birth = new Date(value);
			}
		}

		await Student.updateOne({ _id: id }, { $set: student });
		res.json({ status: 'Correctly updated student' });

	} catch (error) {
		console.log(error)
		res.status(400).json({ error });
	}

	/* #swagger.responses[200] = {
		description: 'Correcly updated student',
		schema: {
			$status: 'Correctly updated student',
		}
	} */
};

studentsController.getStudentById = async (req, res) => {
	// #swagger.tags = ['Students']
	// #swagger.summary = 'Get one student with its results'
	// #swagger.description = 'Gets the student with the list of results ids'

	const { token, studentId } = req.body;
	const user = await verifyTokenAndGetUser(token, res);

	/*  #swagger.parameters['body'] = {
		in: 'body',
		description: 'User to get',
		schema: {
			$token: 'token',
			$studentId: 'studentId'
		}
	} */


	if (user === 'Error') return;

	if (!user.students.includes(studentId)) {
		res.status(400).json({ status: 'This student is not from this user or parameter is Null.' });
		return;
	}

	const student = await Student.findOne({ _id: studentId }).populate('results', "_id testType date finished");

	res.json({ student });
	
	/* #swagger.responses[200] = {
		description: 'Correcly got student',
		schema: {
			$student: {
				$id: 'studentId',
				$alias: 'Nombre',
				$province: 'CABA',
				$locality: 'CABA',
				$birth: '2020-01-01',
				$schoolType: ['Privada', 'Publica'],
				$genre: ['Masculino', 'Femenino', 'Otro'],
				$isSpanish: ['true', 'false'],
				$schoolYear: [0, 1, 2, 3],
				$previousDiagnostic: [true, false],
				$previousDiagnostcDetails: 'Si la respuesta anterior fue true',
				$hand: ['Diestro','Zurdo'],
				$parentsLevel: 'Universitario',
				$results: [
					{
						$_id: "id",
						$testType: "Dislexia",
						$date: "dateObject",
						$finished: true
					}
				]
			},
		}
	} */
};

studentsController.getAllUserStudents = async (req, res) => {
	
	// #swagger.tags = ['Students']
	// #swagger.summary = 'Get a list of all students'
	// #swagger.description = 'This lets you get all students for a certain user'

	const { token } = req.body;
	const user = await verifyTokenAndGetUser(token, res, { populate: 'students' });

	/*  #swagger.parameters['body'] = {
		in: 'body',
		description: 'Session',
		schema: {
			$token: 'token'
		}
	} */

	if (user === 'Error') return;

	res.json(user.students);
	
	/* #swagger.responses[200] = {
		description: 'Correcly got student',
		schema: [
			{
				$id: 'studentId',
				$alias: 'Nombre'
			}
		]
	} */
};

module.exports = studentsController;
