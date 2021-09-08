### detective-module [![npm](http://img.shields.io/npm/v/detective-module.svg)](https://npmjs.org/package/detective-module) [![npm](http://img.shields.io/npm/dm/detective-module.svg)](https://npmjs.org/package/detective-module)

> Get the dependencies specifier of an ES6 module And Require()

`npm install detective-module`

### Usage

```js
var {
  detectiveModuleAndRequire,
  detectiveModule,
} = require("detective-module");

var mySourceCode = fs.readFileSync("myfile.js", "utf8");

// Pass in a file's content or an AST
var dependencies = detective(mySourceCode);

// input:
import Abc, * as BBBBBB from "mylib";

// output
[
  {
    name: "mylib",
    default: "Abc",
    star: true,
    alias: "BBBBBB",
  },
];
```

### Example

```js
// input:
import { foo as Foo, bar } from "mylib";

// output
[
  {
    name: "mylib",
    members: [
      {
        name: "foo",
        alias: "Foo",
      },
      {
        name: "bar",
        alias: "bar",
      },
    ],
  },
];
```

- Supports JSX, Flow, and any other features that [node-source-walk](https://github.com/mrjoelkemp/node-source-walk) supports.

#### License

MIT
