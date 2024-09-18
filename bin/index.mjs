#!/usr/bin/env node

import { argv, stderr, stdout } from "node:process";
import { toLatexListing } from "../lib/index.mjs";
import minimist from "minimist";

import { readFile, writeFile } from "node:fs/promises";

/**
 * @type {(
 *   argv: string[],
 * ) => Promise<void>}
 */
export const main = async (argv) => {
  const options = minimist(argv);
  if (options._.length !== 1) {
    stderr.write(
      "Usage: html-to-latex-listing <input.html> [-o <output.tex>]\n",
    );
    process.exitCode = 1;
  } else {
    const html = await readFile(options._[0], "utf8");
    const latex = toLatexListing(html);
    if ("o" in options) {
      await writeFile(options.o, latex);
    } else {
      stdout.write(latex);
    }
  }
};

await main(argv.slice(2));
