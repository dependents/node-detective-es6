var Walker = require("node-source-walk");

/**
 * Extracts the dependencies of the supplied es6 module
 * @param code
 * @param options
 * @return {*[]}
 */
module.exports = function detectiveModule(code, options) {
  var walker = new Walker(
    Object.assign(
      {
        plugins: [
          "jsx",
          "typescript",
          "doExpressions",
          "objectRestSpread",
          ["decorators", { decoratorsBeforeExport: true }],
          "classProperties",
          "exportDefaultFrom",
          "exportNamespaceFrom",
          "asyncGenerators",
          "functionBind",
          "functionSent",
          "dynamicImport",
          "optionalChaining",
          "nullishCoalescingOperator",
        ],
        allowHashBang: true,
        sourceType: "module",
      },
      options
    )
  );

  var dependencies = [];

  if (!code) {
    throw new Error("src not given");
  }

  walker.walk(code, function (node) {
    switch (node.type) {
      case "ImportDeclaration":
        var dep = {};
        if (node.source && node.source.value) {
          dep.name = node.source.value;
        }
        for (var i = 0; i < node.specifiers.length; i++) {
          var specifiersNode = node.specifiers[i];
          var specifiersType = specifiersNode.type;
          switch (specifiersType) {
            case "ImportDefaultSpecifier":
              dep.default = specifiersNode.local.name;
              break;
            case "ImportSpecifier":
              dep.members = dep.members || [];
              dep.members.push({
                name: specifiersNode.imported.name,
                alias: specifiersNode.local.name,
              });
              break;
            case "ImportNamespaceSpecifier":
              dep.star = true;
              dep.alias = specifiersNode.local.name;
              break;
            default:
              return;
          }
        }
        dependencies.push(dep);
        break;
      case "ExportNamedDeclaration":
        var dep = {};
        if (node.source && node.source.value) {
          dep.name = node.source.value;
          dependencies.push(dep);
        }
        for (var i = 0; i < node.specifiers.length; i++) {
          var specifiersNode = node.specifiers[i];
          var specifiersType = specifiersNode.type;
          switch (specifiersType) {
            case "ExportSpecifier":
              dep.members = dep.members || [];
              dep.members.push({
                name: specifiersNode.local.name,
                alias: specifiersNode.exported.name,
              });
              break;
            default:
              return;
          }
        }
        break;
      case "ExportAllDeclaration":
        if (node.source && node.source.value) {
          dependencies.push({
            name: node.source.value,
          });
        }
        break;
      default:
        return;
    }
  });

  return dependencies;
};
