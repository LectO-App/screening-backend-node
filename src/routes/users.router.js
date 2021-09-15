const Router = require('express').Router;
var jwt = require('express-jwt');

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
router.post('/validateToken', jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), usersController.validateToken);

module.exports = router;
