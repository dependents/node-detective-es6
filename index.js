import Walker from 'node-source-walk';

/**
 * Extracts the dependencies of the supplied es6 module
 *
 * @param  {String|Object} src - File's content or AST
 * @param  {Object} options - optional extra settings
 * @return {String[]}
 */
export default function detective(src, options = {}) {
  if (src === undefined) throw new Error('src not given');
  if (src === '') return [];

  const walker = new Walker();
  const dependencies = [];

  walker.walk(src, node => {
    switch (node.type) {
      case 'ImportDeclaration': {
        if (options.skipTypeImports && node.importKind === 'type') {
          break;
        }

        if (node.source && node.source.value) {
          dependencies.push(node.source.value);
        }

        break;
      }

      case 'ExportNamedDeclaration':
      case 'ExportAllDeclaration': {
        if (node.source && node.source.value) {
          dependencies.push(node.source.value);
        }

        break;
      }

      case 'CallExpression': {
        if (options.skipAsyncImports) {
          break;
        }

        const importArg = node.arguments && node.arguments[0];
        if (node.callee.type === 'Import' && importArg && importArg.value) {
          dependencies.push(importArg.value);
        }

        break;
      }

      default:
        // nothing
    }
  });

  return dependencies;
}
