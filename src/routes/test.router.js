const Router = require('express').Router;

const testController = require('../controllers/test.controller');

const router = new Router();

router.get('/', (req, res) => res.send('results'));

router.post('/start', testController.startTest);
router.post('/answerQuestion', testController.answerQuestion);
// TODO: router.post('/get/:id', testController.getTestById);

module.exports = router;