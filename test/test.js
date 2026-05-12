'use strict';

const assert = require('node:assert').strict;
const { suite } = require('uvu');
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

const test = suite('detective-es6');

test('accepts an AST', () => {
  const deps = detective(ast);
  assert.equal(deps.length, 0);
});

test('retrieves the dependencies of ES6 modules', () => {
  const deps = detective('import {foo, bar} from "mylib";');
  assert.equal(deps.length, 1);
  assert.equal(deps[0], 'mylib');
});

test('retrieves the re-export dependencies of ES6 modules', () => {
  const deps = detective('export {foo, bar} from "mylib";');
  assert.equal(deps.length, 1);
  assert.equal(deps[0], 'mylib');
});

test('retrieves the re-export * dependencies of ES6 modules', () => {
  const deps = detective('export * from "mylib";');
  assert.equal(deps.length, 1);
  assert.equal(deps[0], 'mylib');
});

test('handles multiple imports', () => {
  const deps = detective('import {foo, bar} from "mylib";\nimport "mylib2"');
  assert.equal(deps.length, 2);
  assert.equal(deps[0], 'mylib');
  assert.equal(deps[1], 'mylib2');
});

test('handles default imports', () => {
  const deps = detective('import foo from "foo";');
  assert.equal(deps.length, 1);
  assert.equal(deps[0], 'foo');
});

test('handles dynamic imports', () => {
  const deps = detective('import("foo").then(foo => foo());');
  assert.equal(deps.length, 1);
  assert.equal(deps[0], 'foo');
});

test('returns an empty list for non-ES6 modules', () => {
  const deps = detective('var foo = require("foo");');
  assert.equal(deps.length, 0);
});

test('returns an empty list for empty files', () => {
  const deps = detective('');
  assert.equal(deps.length, 0);
});

test('throws when content is not provided', () => {
  assert.throws(() => {
    detective();
  }, /^Error: src not given$/);
});

test('does not throw with JSX in a module', () => {
  assert.doesNotThrow(() => {
    detective('import foo from "foo"; var templ = <jsx />;');
  });
});

test('does not throw on ES7 async functions', () => {
  assert.doesNotThrow(() => {
    detective('import foo from "foo"; export default async function baz() {}');
  });
});

test('respects settings for type imports', () => {
  const source = 'import type {foo} from "mylib";';
  const depsWithTypes = detective(source);
  const depsWithoutTypes = detective(source, { skipTypeImports: true });
  assert.deepEqual(depsWithTypes, ['mylib']);
  assert.deepEqual(depsWithoutTypes, []);
});

test('respects settings for async imports', () => {
  const source = 'import("myLib")';
  const depsWithAsync = detective(source);
  const depsWithoutAsync = detective(source, { skipAsyncImports: true });
  assert.deepEqual(depsWithAsync, ['myLib']);
  assert.deepEqual(depsWithoutAsync, []);
});

test('respects settings for async imports with multiple imports', () => {
  const source = 'import("myLib");\nimport foo from "foo"';
  const depsWithoutAsync = detective(source, { skipAsyncImports: true });
  assert.deepEqual(depsWithoutAsync, ['foo']);
});

test('skips variable imports', () => {
  const deps = detective('var baz = "bar"; import(baz);');
  assert.equal(deps.length, 0);
});

test.run();
