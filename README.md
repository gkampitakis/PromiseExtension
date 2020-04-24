<h1 align="center"> Promise Extension </h1>

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Build Status](https://travis-ci.org/gkampitakis/PromiseExtension.svg?branch=master)](https://travis-ci.org/gkampitakis/PromiseExtension)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/gkampitakis/PromiseExtension)](https://codecov.io/gh/gkampitakis/PromiseExtension)

<p  align="center">A module containing some useful methods for extending native Promises.</p>

## Usage

```javascript
//Using Node.js `require()`
const PromiseUtil = require('@gkampitakis/promise-util');

//Using ES6 import
import PromiseUtil from '@gkampitakis/promise-util';
```

## Overview

### PromiseUtil.props

Accepts an object containing fields with async code and returns an object with resolved values.

```javascript
const delay = (time, item) => new Promise((resolve: any) => setTimeout(resolve(item), time));

const asyncObject = {
	field: delay(60000, {
		nested: {
			field: 'string'
		}
	}),
	asyncField: fetch('https://jsonplaceholder.typicode.com/todos/1').then((response) => response.json()),
	normalField: {
		array: ['123', '13']
	}
};

PromiseUtil.props(asyncObject).then((object) => {
	console.log(object);
});
```

### PromiseUtil.map

Accepts an array and an async callback function and returns a resolved array.

```javascript
const urlArray = ['https://jsonplaceholder.typicode.com/todos/1', 'https://jsonplaceholder.typicode.com/todos/1'];

PromiseUtil.map(urlArray, (url) => fetch(url).then((response) => response.json()), {
	concurrency: 2
}).then((result) => console.log(result));
```
