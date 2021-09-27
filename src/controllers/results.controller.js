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
        description: 'Data',
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
    } catch (error) {
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

resultsController.getStatsForTest = async (req, res) => {

    // #swagger.tags = ['Results']
    // #swagger.summary = 'Gets statistical data for a test'
    // #swagger.description = 'This function lets you get the corresponding standard deviation and median for the questions of a certain test. Filters can be used.'

    let { token, resultId, filters } = req.body;
    const user = await verifyTokenAndGetUser(token, res);

    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Data',
        schema: {
            $token: 'token',
            $resultId: 'resultId',
            filters: {
                province: "CABA(Opcional)",
                locality: "CABA(Opcional)",
                schoolType: "Privada(Opcional)",
                genre: "Masculino(Opcional)",
                schoolYear: 0,
                previousDiagnostic: false,
            }
        }
    } */

    try {

        const resultRef = await Result.findById(resultId);
        if (resultRef === null || !resultRef.userId.equals(user._id)) res.status(400).json({ status: "This result is not from this user." });

        if (filters === undefined) filters = {};
        filters.testType = resultRef.testType;

        const result = await Answer.aggregate([
            { $match: filters },
            {
                $group: {
                    _id: "$questionName",
                    desvioEstandar: { $stdDevPop: "$score" },
                    mediana: { $avg: "$score" },
                    cantidad: { $sum: 1 },
                }
            },
        ]);

        res.json(result);

    } catch (error) {
        console.log(error)
        res.status(400).json({ error });
    }

    /* #swagger.responses[200] = {
        description: 'Correctly calculated statistics',
        schema: [
            $_id: "nombreDePregunta",
            $desvioEstandar: 1,
            $mediana: 1,
            $cantidad: 10
        ]
    } */
};

module.exports = resultsController;
