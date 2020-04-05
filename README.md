<h1 align="center"> Promise Extension </h1>

<p  align="center">A module containing some useful methods for extending native Promises.</p>

## Usage

```javascript
const Promise = require('@gkampitakis/promise-util');

Promise.map();
Promise.props();
```

On root directory in `playground.js` there is an example of both methods how to use them. You can run `npm run start` to see the result.

## Methods:

-   **Promise.props**

    Accepts an object containing fields with async calls and returns the object resolved.

*   **Promise.map**

    Accepts an array and an async callback function and returns a resolved array.
