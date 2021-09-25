require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json')

const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const studentsRouter = require('./routes/students.router');
const testRouter = require('./routes/test.router');
const usersRouter = require('./routes/users.router');

const User = require('./models/User');
const Student = require('./models/Student');
const Result = require('./models/Result');
const Answer = require('./models/Answer');

mongoose.connect(process.env.DB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	retryWrites: false,
});

const connection = mongoose.connection;

connection.once('open', () => {
	console.log('Database connected');
});

app.use(helmet());
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3030;

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use('/users', usersRouter);
app.use('/students', studentsRouter);
app.use('/test', testRouter);

app.listen(PORT, () => {
	console.log('Server started at port ' + PORT);
});
