var {
  detectiveModule: detective,
  detectiveModuleAndRequire,
} = require("../index.js");

describe("detective-es6", function () {
  var ast = {
    type: "Program",
    body: [
      {
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "x",
            },
            init: {
              type: "Literal",
              value: 4,
              raw: "4",
            },
          },
        ],
        kind: "let",
      },
    ],
  };

  it("accepts an ast", function () {
    var deps = detective(ast);
    expect(deps).toMatchSnapshot();
  });

  it("retrieves the dependencies of es6 modules", function () {
    var deps = detective('import Abc, * as All from "mylib";');
    expect(deps).toMatchSnapshot();
  });

  it("impoet ImportNamespaceSpecifier the dependencies of es6 modules", function () {
    var deps = detective('import Abc, {a, b, c as d}from "mylib";');
    expect(deps).toMatchSnapshot();
  });

  it("retrieves the re-export dependencies of es6 modules", function () {
    var deps = detective('export {foo, bar} from "mylib";');
    expect(deps).toMatchSnapshot();
  });

  it("retrieves the re-export dependencies alias of es6 modules", function () {
    var deps = detective('export {foo as Foo} from "mylib";');
    expect(deps).toMatchSnapshot();
  });

  it("retrieves the re-export * dependencies of es6 modules", function () {
    var deps = detective('export * from "mylib";');
    expect(deps).toMatchSnapshot();
  });

  it("handles multiple imports", function () {
    var deps = detective(
      'import {foo as Foo, bar} from "mylib";\nimport "mylib2"'
    );

    expect(deps).toMatchSnapshot();
  });

  it("handles default imports", function () {
    var deps = detective('import foo from "foo";');

    expect(deps).toMatchSnapshot();
  });

  it("support typescript", function () {
    var deps = detective('import foo from "foo"; var a: string = "";');

    expect(deps).toMatchSnapshot();
  });

  it("returns an empty list for non-es6 modules", function () {
    var deps = detective('var foo = require("foo");');
    expect(deps).toMatchSnapshot();
  });

  it("does not throw with jsx in a module", function () {
    expect(() => {
      detective('import foo from "foo"; var templ = <jsx />;');
    }).not.toThrow();
  });

  it("does not throw on an async ES7 function", function () {
    expect(() => {
      detective(
        'import foo from "foo"; export default async function bar() {}'
      );
    }).not.toThrow();
  });

  it("case1", function () {
    expect(
      detective(`import React, { Component } from 'react';
import {fetchUser} from '@/service/user';
export default class Home extends Component {
    static pageConfig = { fixedIcon: { backHome: false } };
    componentDidMount () {
        console.log('===== auth ======');
        WPT.setTitle(' ');
        fetchUser();
    }
    render() {
        return (
            <div></div>
        );
    }
}
`)
    ).toMatchSnapshot();
  });

  it("case2", function () {
    expect(
      detective(`import Cookies from 'js-cookie';
export function saveUserToken () {
}
`)
    ).toMatchSnapshot();
  });
});

describe("detective-module-and-require", function () {
  var ast = {
    type: "Program",
    body: [
      {
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "x",
            },
            init: {
              type: "Literal",
              value: 4,
              raw: "4",
            },
          },
        ],
        kind: "let",
      },
    ],
  };

  it("accepts an ast", function () {
    var deps = detectiveModuleAndRequire(ast);
    expect(deps).toMatchSnapshot();
  });

  it("retrieves the dependencies of es6 modules", function () {
    var deps = detectiveModuleAndRequire('import Abc, * as All from "mylib";');
    expect(deps).toMatchSnapshot();
  });

  it("impoet ImportNamespaceSpecifier the dependencies of es6 modules", function () {
    var deps = detectiveModuleAndRequire(
      'import Abc, {a, b, c as d}from "mylib";'
    );
    expect(deps).toMatchSnapshot();
  });

  it("retrieves the re-export dependencies of es6 modules", function () {
    var deps = detectiveModuleAndRequire('export {foo, bar} from "mylib";');
    expect(deps).toMatchSnapshot();
  });

  it("retrieves the re-export dependencies alias of es6 modules", function () {
    var deps = detectiveModuleAndRequire('export {foo as Foo} from "mylib";');
    expect(deps).toMatchSnapshot();
  });

  it("retrieves the re-export * dependencies of es6 modules", function () {
    var deps = detectiveModuleAndRequire('export * from "mylib";');
    expect(deps).toMatchSnapshot();
  });

  it("handles multiple imports", function () {
    var deps = detectiveModuleAndRequire(
      'import {foo as Foo, bar} from "mylib";\nimport "mylib2"'
    );

    expect(deps).toMatchSnapshot();
  });

  it("handles default imports", function () {
    var deps = detectiveModuleAndRequire('import foo from "foo";');

    expect(deps).toMatchSnapshot();
  });

  it("support typescript", function () {
    var deps = detectiveModuleAndRequire(
      'import foo from "foo"; var a: string = "";'
    );

    expect(deps).toMatchSnapshot();
  });

  it("support non-es6 modules", function () {
    var deps = detectiveModuleAndRequire('var bar = require("foo");');
    expect(deps).toMatchSnapshot();
  });

  it("support non-es6 exports", function () {
    var deps = detectiveModuleAndRequire(
      'var {default: foo, a, b: c} = require("foo");'
    );
    expect(deps).toMatchSnapshot();
  });

  it("does not throw with jsx in a module", function () {
    expect(() => {
      detectiveModuleAndRequire('import foo from "foo"; var templ = <jsx />;');
    }).not.toThrow();
  });

  it("does not throw on an async ES7 function", function () {
    expect(() => {
      detectiveModuleAndRequire(
        'import foo from "foo"; export default async function bar() {}'
      );
    }).not.toThrow();
  });

  it("case1", function () {
    expect(
      detectiveModuleAndRequire(`import React, { Component } from 'react';

import {fetchUser} from '@/service/user';

export default class Home extends Component {
    static pageConfig = { fixedIcon: { backHome: false } };
    componentDidMount () {
        console.log('===== auth ======');
        WPT.setTitle(' ');
        fetchUser();
    }

    render() {
        return (
            <div></div>
        );
    }
}
`)
    ).toMatchSnapshot();
  });

  it("case2", function () {
    expect(
      detectiveModuleAndRequire(`import Cookies from 'js-cookie';
export function saveUserToken () {
}
`)
    ).toMatchSnapshot();
  });
});
