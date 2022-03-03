/* eslint-env mocha */

'use strict';

const assert = require('assert').strict;
const detective = require('../index.js');

const ast = {
  type: 'Program',
  body: [{
    type: 'VariableDeclaration',
    declarations: [{
      type: 'VariableDeclarator',
      id: {
        type: 'Identifier',
        name: 'x'
      },
      init: {
        type: 'Literal',
        value: 4,
        raw: '4'
      }
    }],
    kind: 'let'
  }]
};

describe('detective-es6', () => {
  it('accepts an ast', () => {
    const deps = detective(ast);
    assert.equal(deps.length, 0);
  });

  it('retrieves the dependencies of es6 modules', () => {
    const deps = detective('import {foo, bar} from "mylib";');
    assert.equal(deps.length, 1);
    assert.equal(deps[0], 'mylib');
  });

  it('retrieves the re-export dependencies of es6 modules', () => {
    const deps = detective('export {foo, bar} from "mylib";');
    assert.equal(deps.length, 1);
    assert.equal(deps[0], 'mylib');
  });

  it('retrieves the re-export * dependencies of es6 modules', () => {
    const deps = detective('export * from "mylib";');
    assert.equal(deps.length, 1);
    assert.equal(deps[0], 'mylib');
  });

  it('handles multiple imports', () => {
    const deps = detective('import {foo, bar} from "mylib";\nimport "mylib2"');

    assert.equal(deps.length, 2);
    assert.equal(deps[0], 'mylib');
    assert.equal(deps[1], 'mylib2');
  });

  it('handles default imports', () => {
    const deps = detective('import foo from "foo";');

    assert.equal(deps.length, 1);
    assert.equal(deps[0], 'foo');
  });

  it('handles dynamic imports', () => {
    const deps = detective('import("foo").then(foo => foo());');

    assert.equal(deps.length, 1);
    assert.equal(deps[0], 'foo');
  });

  it('returns an empty list for non-es6 modules', () => {
    const deps = detective('var foo = require("foo");');
    assert.equal(deps.length, 0);
  });

  it('returns an empty list for empty files', () => {
    const deps = detective('');
    assert.equal(deps.length, 0);
  });

  it('throws when content is not provided', () => {
    assert.throws(() => {
      detective();
    }, Error, 'src not given');
  });

  it('does not throw with jsx in a module', () => {
    assert.doesNotThrow(() => {
      detective('import foo from "foo"; var templ = <jsx />;');
    });
  });

  it('does not throw on an async ES7 function', () => {
    assert.doesNotThrow(() => {
      detective('import foo from "foo"; export default async function baz() {}');
    });
  });

  it('respects settings for type imports', () => {
    const source = 'import type {foo} from "mylib";';
    const depsWithTypes = detective(source);
    const depsWithoutTypes = detective(source, { skipTypeImports: true });
    assert.deepEqual(depsWithTypes, ['mylib']);
    assert.deepEqual(depsWithoutTypes, []);
  });

  it('respects settings for async imports', () => {
    const source = 'import("myLib")';
    const depsWithAsync = detective(source);
    const depsWithoutAsync = detective(source, { skipAsyncImports: true });
    assert.deepEqual(depsWithAsync, ['myLib']);
    assert.deepEqual(depsWithoutAsync, []);
  });

  it('respects settings for async imports with multiple imports', () => {
    const source = 'import("myLib");\nimport foo from "foo"';
    const depsWithoutAsync = detective(source, { skipAsyncImports: true });
    assert.deepEqual(depsWithoutAsync, ['foo']);
  });

  it('skips variable imports', () => {
    const deps = detective('var baz = "bar"; import(baz);');
    assert.equal(deps.length, 0);
  });
});
