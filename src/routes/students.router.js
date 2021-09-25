const Router = require('express').Router;

const studentsController = require('../controllers/students.controller');

const router = new Router();

router.post('/create', studentsController.createStudent);
router.post('/delete', studentsController.deleteStudent);
router.post('/modify', studentsController.modifyStudent);
router.post('/get', studentsController.getAllUserStudents);
router.post('/getById', studentsController.getStudentById);

module.exports = router;
