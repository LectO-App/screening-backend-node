const Router = require('express').Router;

const resultsController = require('../controllers/results.controller');

const router = new Router();

router.post('/getResult', resultsController.getResult);

module.exports = router;