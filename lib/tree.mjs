import { UnreachableError } from "./error.mjs";

/**
 * @type {(
 *   tree: import("./tree").Tree,
 * ) => string}
 */
export const joinTree = (tree) => {
  /** @type {string[]} */
  const chunks = [];
  /** @type {import("./tree").Tree[]} */
  const todo = [tree];
  while (todo.length > 0) {
    const node = /** @type {import("./tree").Tree} */ (todo.pop());
    if (typeof node === "string") {
      chunks.push(node);
    } else if (Array.isArray(node)) {
      for (let index = node.length - 1; index >= 0; index--) {
        todo.push(node[index]);
      }
    } else {
      throw new UnreachableError(node);
    }
  }
  return chunks.join("");
};
