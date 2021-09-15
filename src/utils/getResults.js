const Result = require('../models/Result');

module.exports = async function getResults(resultIds) {
	let results = [];

	if (resultIds.length > 0) {
		await Promise.all(
			resultIds.map(async id => {
				const result = await Result.findById(id);

				const answersIndexes = {
					0: 'letters-question',
					1: 'letters-question',
					2: 'matching',
					3: 'syllables',
					4: 'syllables',
					5: 'syllables',
					6: 'syllables',
					7: 'syllables',
					8: 'multiple-choice',
					9: 'multiple-choice',
					10: 'multiple-choice',
					11: 'multiple-choice',
					12: 'multiple-choice',
					13: 'multiple-choice',
					14: 'multiple-choice',
					15: 'gap-question',
					16: 'counting',
					17: 'counting',
					18: 'counting',
					19: 'counting',
					20: 'counting',
					21: 'letters-question-2',
					22: 'multiple-choice-2',
					23: 'multiple-choice-2',
					24: 'multiple-choice-2',
					25: 'multiple-choice-2',
					26: 'multiple-choice-2',
					27: 'prev-next',
					28: 'prev-next',
					29: 'prev-next',
					30: 'prev-next',
					31: 'prev-next',
					32: 'gap-question-2',
					33: 'gap-question-2',
					34: 'gap-question-2',
					35: 'multiple-choice-3',
					36: 'multiple-choice-3',
					37: 'multiple-choice-3',
				};

				let answersResults = {
					'letters-question': {
						correct: [],
						incorrect: [],
						state: 'risk',
						category: 'math',
						label: 'Prueba de conocimiento alfabético',
					},
					matching: {
						correct: [],
						incorrect: [],
						state: 'risk',
						category: 'math',
						label: 'Prueba de conciencia fonológica',
					},
					syllables: {
						correct: [],
						incorrect: [],
						state: 'risk',
						category: 'math',
						label: 'Prueba de conciencia silábica',
					},
					'multiple-choice': {
						correct: [],
						incorrect: [],
						state: 'risk',
						category: 'math',
						label: 'Prueba de vocabulario',
					},
					'gap-question': {
						correct: [],
						incorrect: [],
						state: 'risk',
						category: 'math',
						label: 'Prueba de conteo en voz alta',
					},
					counting: {
						correct: [],
						incorrect: [],
						state: 'risk',
						category: 'math',
						label: 'Prueba de conteo termino a termino',
					},
					'letters-question-2': {
						correct: [],
						incorrect: [],
						state: 'risk',
						category: 'math',
						label: 'Prueba de reconocimiento de número',
					},
					'multiple-choice-2': {
						correct: [],
						incorrect: [],
						state: 'risk',
						category: 'math',
						label: 'Prueba de comparación numérica',
					},
					'prev-next': {
						correct: [],
						incorrect: [],
						state: 'risk',
						category: 'math',
						label: 'Prueba de secuencia numérica',
					},
					'gap-question-2': {
						correct: [],
						incorrect: [],
						state: 'risk',
						category: 'math',
						label: 'Prueba de subitización',
					},
					'multiple-choice-3': {
						correct: [],
						incorrect: [],
						state: 'risk',
						category: 'math',
						label: 'Prueba de estimación de cantidad',
					},
				};

				result.answers.forEach((answer, i) => {
					const type = answersIndexes[i];

					if (answer.correct === true) {
						answersResults[type].correct.push(answer);
					} else {
						answersResults[type].incorrect.push(answer);
					}
				});

				const performance = checkResultPerformance(Object.values(answersResults));
				results.push({ result, answersResults, performance });
			})
		);
	}

	return results;
};

const checkResultPerformance = answers => {
	// here you would say if the student is good, decent or at risk
	// for now, will return always "En riesgo"

	let performance = {
		math: { total: 0, correct: 0, state: 'en riesgo' },
		literacy: { total: 0, correct: 0, state: 'en riesgo' },
	};

	answers.forEach(answer => {
		performance[answer.category].total += answer.correct.length + answer.incorrect.length;
		performance[answer.category].correct += answer.correct.length;
	});

	return performance;
};

// Revisar
// Hacer curva de gauss por todos los estudiantes del mismo usuario