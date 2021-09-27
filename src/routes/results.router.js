const Router = require('express').Router;

const resultsController = require('../controllers/results.controller');

const router = new Router();

router.post('/getResult', resultsController.getResult);
router.post('/getStatistics', resultsController.getStatsForTest);

module.exports = router;