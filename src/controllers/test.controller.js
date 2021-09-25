const { verifyTokenAndGetUser } = require('../auth/tokenManager');

const Student = require('../models/Student');
const Result = require('../models/Result');

const testController = {};

testController.startTest = async (req, res) => {

	// #swagger.tags = ['Tests']
	// #swagger.summary = 'Start test'
	// #swagger.description = 'Starts a new test'

	const { token, student, testType } = req.body;
	const user = await verifyTokenAndGetUser(token, res);

	/*  #swagger.parameters['body'] = {
		in: 'body',
		description: 'User to delete',
		schema: {
			$token: 'token',
			$student: 'studentId',
			$testType: ['Dislexia', 'Discalculia']
		}
	} */

	if (!user.students.includes(student)) {
		res.json({ status: 'This student is not from this user.' });
		return;
	}

	try {
		user.takenTests += 1;
		const studentRef = await Student.findOne({ _id: student });
	
		const resultRef = new Result({ testType });
		studentRef.results.push(resultRef._id);
	
		await resultRef.save();
		await studentRef.save();
		await user.save();
	
		return res.json({ resultId: resultRef._id });
	
	} catch (error) {
		return res.status(400).json({ error });
	}


	/* #swagger.responses[200] = {
		description: 'New test started',
		schema: {
			$resultId: 'ID to submit answers',
		}
	} */
};

testController.answerQuestion = async (req, res) => {
	// #swagger.tags = ['Tests']
	// #swagger.summary = 'Answer Question'
	// #swagger.description = 'Answers a question for a certain test. You have to give a unique question name to each question, so that it is stored separately. You can answer each type of question once per test.'

	const { token, student, resultId, score, answer } = req.body;
	const userRef = await verifyTokenAndGetUser(token, res);

	/*  #swagger.parameters['body'] = {
		in: 'body',
		description: 'User to delete',
		schema: {
			$token: 'token',
			$student: 'studentId',
			$resultId: 'resultId',
			$questionName: 'Question Name',
			$score: 10,
			$answer: {
				info: "Here you can store an object with extra information for the task."
			}
		}
	} */

	// Validation start
	if (!userRef.students.includes(student)) {
		res.json({ status: 'This student is not from this user.' });
		return;
	}

	const studentRef = await Student.findOne({ _id: student });
	if (!studentRef.results.includes(resultId)) {
		res.json({ status: 'This test is not from this student.' });
		return;
	}

	const resultRef = await Result.findOne({ _id: resultId });
	if (resultRef.finished === true) {
		res.json({ status: 'Test already finished.' });
		return;
	}
	// Validation end

	

	await resultRef.save();
	res.json({ status: 'Question answered.' });
};

module.exports = testController;
