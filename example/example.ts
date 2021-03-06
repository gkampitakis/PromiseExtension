import * as PromisesExtension from '../src/PromisesExtension';
import fetch from 'node-fetch';

const delay = (time, item: any = undefined) =>
  new Promise((resolve: any) => setTimeout(resolve(item), time));

async function Main () {
  const asyncObject = {
    test: delay(60000, {
      hello: {
        test: 'string',
      },
    }),
    test2: fetch(
      'https://jsonplaceholder.typicode.com/todos/1',
      {}
    ).then((response) => response.json()),
    normal: {
      array: ['123', '13'],
    },
  };

  PromisesExtension.props(asyncObject).then((object) => {
    console.log(object);
  });

  const urlArray = [
    'https://jsonplaceholder.typicode.com/todos/1',
    'https://jsonplaceholder.typicode.com/todos/1',
    'https://jsonplaceholder.typicode.com/todos/1',
    'https://jsonplaceholder.typicode.com/todos/1',
    'https://jsonplaceholder.typicode.com/todos/1',
    'https://jsonplaceholder.typicode.com/todos/1',
    'https://jsonplaceholder.typicode.com/todos/1',
    'https://jsonplaceholder.typicode.com/todos/1',
    'https://jsonplaceholder.typicode.com/todos/1',
  ];

  PromisesExtension.map(
    urlArray,
    (url) => fetch(url, {}).then((response) => response.json()),
    {
      concurrency: 2,
    }
  ).then((result) => console.log(result));

  PromisesExtension.each(
    ['1', Promise.resolve('2'), 3, delay(5000, '4')],
    (value, index, length) => {
      console.log(value, index, length);
    }
  ).then((res) => console.log(res));

  PromisesExtension.delay(1000, false, () =>
    fetch('https://jsonplaceholder.typicode.com/todos/1', {}).then((response) =>
      response.json()
    )
  ).then((result) => {
    console.log(result);
  });
}

Main();
