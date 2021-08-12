const { verifyTokenAndGetUser } = require('../auth/tokenManager');

const Student = require('../models/Student');
const Result = require('../models/Result');
const Test = require('../models/Test');

const testController = {};

testController.startTest = async (req, res) => {
	const { token, student } = req.body;
	const user = await verifyTokenAndGetUser(token, res);

	if (!user.students.includes(student)) {
		res.json({ status: 'This student is not from this user.' });
		return;
	}

	if (user.paidTests < 0) {
		res.json({ status: 'No tests remaining. Please buy more tests.' });
		return;
	}

	user.paidTests += 1;
	const studentRef = await Student.findOne({ _id: student });
	const testRef = await Test.findOne({ _id: '60422c4bed2541b30a910b81' });

	const resultRef = new Result({ test: testRef._id, answers: Array(testRef.questions.length).fill({}) });
	studentRef.results.push(resultRef._id);

	await resultRef.save();
	await studentRef.save();
	await user.save();

	return res.json({ questions: testRef.questions, testId: testRef._id, resultId: resultRef._id });
};

testController.answerQuestion = async (req, res) => {
	const { token, student, resultId, question, answer } = req.body;
	const userRef = await verifyTokenAndGetUser(token, res);

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

	if (!(question >= -1 && question < resultRef.answers.length)) {
		res.json({ status: 'This question does not exist.' });
		return;
	} else if (question === -1) {
		if (answer.length === resultRef.answers.length) {
			res.json({ status: 'There must be one answer for each question' });
			return;
		}
		resultRef.answers = answer;
		resultRef.finished = true;
	} else {
		resultRef.answers[question] = answer;
		resultRef.markModified('answers');
		if (question === resultRef.answers.length - 1) resultRef.finished = true;
	}

	await resultRef.save();
	res.json({ status: 'Question answered.' });
};

module.exports = testController;
