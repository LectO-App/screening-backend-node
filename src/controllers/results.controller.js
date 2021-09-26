const { verifyTokenAndGetUser, verifyToken } = require('../auth/tokenManager');

const Student = require('../models/Student');
const Result = require('../models/Result');
const Answer = require('../models/Answer');

const resultsController = {};

resultsController.getResult = async (req, res) => {

	// #swagger.tags = ['Results']
	// #swagger.summary = 'Gets a complete test result'
	// #swagger.description = 'This function lets you get a complete result from a test, corresponding to a user'

	const { token, resultId } = req.body;
	const user = await verifyTokenAndGetUser(token, res);

	/*  #swagger.parameters['body'] = {
		in: 'body',
		description: 'User to create',
		schema: {
			$token: 'token',
			$resultId: 'resultId',
		}
	} */

    try {
        const resultRef = await Result.findById(resultId);
        console.log(resultRef.userId);
        console.log(user._id);
        if (resultRef === null || !resultRef.userId.equals(user._id)) res.status(400).json({ status: "This result is not from this user." });
        res.json(resultRef);
    } catch( error) {
        res.status(400).json({ error });
    }

	/* #swagger.responses[200] = {
		description: 'Correcly got test',
		schema: {
			$testType: ['Dislexia', 'Discalculia'],
            $date: 'Date',
            $finished: true,
            $answers: {
                questionName: {
                    score: 10,
                    answer: {}
                }
            }
		}
	} */
};

module.exports = resultsController;
