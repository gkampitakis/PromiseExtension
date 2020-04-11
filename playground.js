const Promise = require('./src');
const fetch = require('node-fetch');

const delay = (time, item = null) => new Promise((resolve) => setTimeout(resolve(item), time));

async function Main() {
	const asyncObject = {
		test: delay(60000, {
			hello: {
				test: 'string'
			}
		}),
		test2: fetch('https://jsonplaceholder.typicode.com/todos/1').then((response) => response.json()),
		normal: {
			array: ['123', '13']
		}
	};

	Promise.props(asyncObject).then((object) => {
		console.log(object);
	});

	Promise.map(
		[
			'https://jsonplaceholder.typicode.com/todos/1',
			'https://jsonplaceholder.typicode.com/todos/1',
			'https://jsonplaceholder.typicode.com/todos/1',
			'https://jsonplaceholder.typicode.com/todos/1',
			'https://jsonplaceholder.typicode.com/todos/1',
			'https://jsonplaceholder.typicode.com/todos/1',
			'https://jsonplaceholder.typicode.com/todos/1',
			'https://jsonplaceholder.typicode.com/todos/1',
			'https://jsonplaceholder.typicode.com/todos/1'
		],
		(url) => fetch(url).then((response) => response.json()),
		{ concurrency: 2 }
	).then((result) => console.log(result));
}

Main();
