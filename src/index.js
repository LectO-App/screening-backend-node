require('dotenv').config();

const express = require('express');

const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const studentsRouter = require('./routes/students.router');
const resultsRouter = require('./routes/test.router');
const usersRouter = require('./routes/users.router');

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

app.get('/', (_, res) => res.send('Bienvenido a Screening Dislexia'));

app.use('/students', studentsRouter);
app.use('/results', resultsRouter);
app.use('/users', usersRouter);

app.listen(PORT, () => {
	console.log('Server started at port ' + PORT);
});
