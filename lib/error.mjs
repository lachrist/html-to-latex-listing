export class UnreachableError extends Error {
  constructor(/** @type {never} */ cause) {
    console.dir(cause);
    super("Unreachable", { cause });
  }
}

export class ParseError extends Error {
  constructor(
    /** @type {string} */ message,
    /** @type {import("node-html-parser").Node} */ cause,
  ) {
    super(message, { cause });
  }
}
