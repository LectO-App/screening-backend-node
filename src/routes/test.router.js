const Router = require('express').Router;

const testController = require('../controllers/test.controller');

const router = new Router();

router.post('/start', testController.startTest);
router.post('/answerQuestion', testController.answerQuestion);
router.post('/finishTest', testController.finishTest);

module.exports = router;
