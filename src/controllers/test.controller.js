const { verifyTokenAndGetUser } = require('../auth/tokenManager');

const Student = require('../models/Student');
const Result = require('../models/Result');
const Answer = require('../models/Answer')

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
	
		const resultRef = new Result({ userId: user._id, studentId: studentRef._id, testType });
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

	const { token, student, resultId, questionName, score, answer } = req.body;
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
		res.staus(400).json({ status: 'This student is not from this user.' });
		return;
	}

	const studentRef = await Student.findOne({ _id: student });
	if (!studentRef.results.includes(resultId)) {
		res.status(400).json({ status: 'This test is not from this student.' });
		return;
	}

	const resultRef = await Result.findOne({ _id: resultId });
	if (resultRef.finished === true) {
		res.status(400).json({ status: 'Test already finished.' });
		return;
	}
	// Validation end

	try {
		if (resultRef.answers.hasOwnProperty(questionName)) {
			res.status(400).json({ status: 'Question already answered.' });
		}

		resultRef.answers = {...resultRef.answers, [questionName]: {score, answer}};
		
		const answerEntry = new Answer({
			userId: userRef._id,
			studentId: studentRef._id,
			testId: resultRef._id,
			testType: resultRef.testType,
			questionName: questionName,
			province: studentRef.province,
			locality: studentRef.locality,
			schoolType: studentRef.schoolType,
			genre: studentRef.genre,
			schoolYear: studentRef.schoolYear,
			previousDiagnostic: studentRef.previousDiagnostic,
			score: score
		});

		await resultRef.save();
		console.log(resultRef.answers);
		await answerEntry.save();

		res.json({ status: 'Question answered.' });
	} catch (error) {
		return res.status(400).json({ error });
	}

	/* #swagger.responses[200] = {
		description: 'Success',
		schema: {
			$status: 'Question answered.',
		}
	} */
};

testController.finishTest = async (req, res) => {
	// #swagger.tags = ['Tests']
	// #swagger.summary = 'Finish test'
	// #swagger.description = 'Finishes a test after answering all questions'

	const { token, student, resultId } = req.body;
	const userRef = await verifyTokenAndGetUser(token, res);

	/*  #swagger.parameters['body'] = {
		in: 'body',
		description: 'User to delete',
		schema: {
			$token: 'token',
			$student: 'studentId',
			$resultId: 'resultId',
		}
	} */

	// Validation start
	if (!userRef.students.includes(student)) {
		res.staus(400).json({ status: 'This student is not from this user.' });
		return;
	}

	const studentRef = await Student.findOne({ _id: student });
	if (!studentRef.results.includes(resultId)) {
		res.status(400).json({ status: 'This test is not from this student.' });
		return;
	}

	const resultRef = await Result.findOne({ _id: resultId });
	if (resultRef.finished === true) {
		res.status(400).json({ status: 'Test already finished.' });
		return;
	}
	// Validation end

	try {

		resultRef.finished = true;
		await resultRef.save();
		res.json({ status: 'Test finished!' });

	} catch (error) {
		return res.status(400).json({ error });
	}

	/* #swagger.responses[200] = {
		description: 'Success',
		schema: {
			$status: 'Test finished!',
		}
	} */
}

module.exports = testController;
