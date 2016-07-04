### detective-es6 [![npm](http://img.shields.io/npm/v/detective-module.svg)](https://npmjs.org/package/detective-module) [![npm](http://img.shields.io/npm/dm/detective-module.svg)](https://npmjs.org/package/detective-module)

> Get the dependencies specifier of an ES6 module

`npm install detective-module`

### Usage

```js
var detective = require('detective-module');

var mySourceCode = fs.readFileSync('myfile.js', 'utf8');

// Pass in a file's content or an AST
var dependencies = detective(mySourceCode);

// input:
import Abc, * as BBBBBB from "mylib";

// output
[{
  "name": "mylib",
  "default": "Abc",
  "star": true,
  "alias": "BBBBBB"
}]

```

* Supports JSX, Flow, and any other features that [node-source-walk](https://github.com/mrjoelkemp/node-source-walk) supports.

#### License

MIT
