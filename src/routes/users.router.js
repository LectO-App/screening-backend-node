const Router = require('express').Router;

const usersController = require('../controllers/users.controller');

const router = new Router();

router.get('/', (req, res) => res.send('user'));

//router.post('/buyTests', usersController.signUp);
router.post('/signIn', usersController.signIn);
router.post('/signUp', usersController.signUp);
// router.post('/get', usersController.getAllUsers);
router.post('/get', usersController.getUserById);
router.post('/sendEmail', usersController.sendEmail);
router.post('/verifyEmail', usersController.verifyEmail);
router.post('/validateToken', usersController.validateToken);

module.exports = router;
