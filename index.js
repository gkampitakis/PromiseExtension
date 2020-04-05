const Promise = require('./PromisesExtension');
const fetch = require('node-fetch');

const delay = (time, item = null) =>
	new Promise((resolve) => setTimeout(resolve(item), time));

async function Main() {
	const asyncObject = {
		test: delay(60000, {
			hello: {
				test: 'string',
			},
		}),
		test2: fetch(
			'https://jsonplaceholder.typicode.com/todos/1'
		).then((response) => response.json()),
		normal: {
			array: ['123', '13'],
		},
	};

	Promise.props(asyncObject).then((object) => {
		console.log(object);
	});

}

Main();
