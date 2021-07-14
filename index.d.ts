import { ParserOptions } from "@babel/parser";

interface DefaultSpec {
  default: string;
  name: string;
}

interface NamespaceSpec {
  alias: string;
  default: string;
  name: string;
  star: true;
}

interface ImportSpecifier {
  default?: string;
  members: { alias: string; name: string }[];
  name: string;
}

type ModuleSpecs = NamespaceSpec | DefaultSpec | ImportSpecifier;

/**
 * Extracts the dependencies of the supplied es6 module
 * @param path file path or babel ast object
 * @param options
 */
declare function detectiveModule(
  path: string | object,
  options?: ParserOptions
): ModuleSpecs[];
export default detectiveModule;
