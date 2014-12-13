### detective-es6 [![npm](http://img.shields.io/npm/v/detective-es6.svg)](https://npmjs.org/package/detective-es6) [![npm](http://img.shields.io/npm/dm/detective-es6.svg)](https://npmjs.org/package/detective-es6)

> Get the dependencies of an ES6 module

`npm install detective-es6`

### Usage

```js
var detective = require('detective-es6');

var mySourceCode = fs.readFileSync('myfile.js', 'utf8');

var dependencies = detective(mySourceCode);
```
