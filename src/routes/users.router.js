const Router = require('express').Router;
var jwt = require('express-jwt');

const usersController = require('../controllers/users.controller');

const router = new Router();

router.post('/signIn', usersController.signIn);
router.post('/signUp', usersController.signUp);
router.post('/get', usersController.getUserById);
router.post('/sendEmail', usersController.sendEmail);
router.post('/verifyEmail', usersController.verifyEmail);
router.post('/validateToken', usersController.validateToken);
router.post('/restorePasswordEmail', usersController.sendRestorePassword);
router.post('/restorePassword', usersController.restorePassword);

module.exports = router;
