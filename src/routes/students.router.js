const Router = require('express').Router;

const studentsController = require('../controllers/students.controller');

const router = new Router();

router.get('/', (_, res) => res.send('patients'));

router.post('/create', studentsController.createStudent);
router.post('/delete', studentsController.deleteStudent);
router.post('/modify', studentsController.modifyStudent);
router.post('/get', studentsController.getAllUserStudents);
router.post('/get/:id', studentsController.getStudentById);

module.exports = router;
