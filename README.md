# Promises Extension

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Build Status](https://travis-ci.com/gkampitakis/promises-extension.svg?branch=master)](https://travis-ci.com/gkampitakis/promises-extension)

A module containing some useful methods for extending native Promises.

## Usage

```javascript
//Using Node.js `require()`
const PromisesExtension = require('promises-extension');

//Using ES6 import
import PromisesExtension from 'promises-extension';
```

## Overview

### PromisesExtension.props

Accepts an object containing fields with async code and returns an object with resolved values.

> Supports nested object with promises.

```javascript
const delay = (time, item) =>
    new Promise((resolve: any) => setTimeout(resolve(item), time));

const asyncObject = {
    field: delay(60000, {
        nested: {
            field: 'string',
        },
    }),
    asyncField: fetch(
        'https://jsonplaceholder.typicode.com/todos/1'
    ).then((response) => response.json()),
    normalField: {
        array: ['123', '13'],
    },
};

PromisesExtension.props(asyncObject).then((object) => {
    console.log(object);
});
```

### PromisesExtension.map

Accepts an array and an async callback function and returns a resolved array.

```javascript
const urlArray = [
    'https://jsonplaceholder.typicode.com/todos/1',
    'https://jsonplaceholder.typicode.com/todos/1',
];

PromisesExtension.map(
    urlArray,
    (url) => fetch(url).then((response) => response.json()),
    {
        concurrency: 2,
    }
).then((result) => console.log(result));
```

### PromisesExtension.each

Accepts an array and an async callback function which can be called with 3 parameters `value,index.arrayLength` and returns the array resolved.

```javascript
PromisesExtension.each(
    ['1', Promise.resolve('2'), 3, delay(5000, '4')],
    (value, index, length) => {
        console.log(value, index, length);
    }
).then((res) => console.log(res));
```

### PromisesExtension.delay

Accepts an integer number and an optional callback async function. Returns a promise that will resolve after the a delay in the specified time in ms.

```javascript
PromisesExtension.delay(1000, () => Promise.resolve('1')).then((result) => {
    console.log(result);
});
```

It can also have an optional boolean parameter

```javascript
PromisesExtension.delay(1000, true, () => Promise.resolve('1')).then(
    (result) => {
        console.log(result);
    }
);
```

which determines the order in which the delay is going to take place. If the parameter is `true` first the callback function is executed
and then the delay happens as if the parameter is false first waits for the delay and then executes the function.

> The default behavior is first wait for the delay and then execute the function.

### Promises.allSettled

A polyfill for native Promise.allSettled introduced at 12.10 version.

### Changelog

[CHANGELOG.md](./CHANGELOG.md)

### Example

You can also check an [example](./example) usage.

### Issues

For any [issues](https://github.com/gkampitakis/promises-extension/issues).
