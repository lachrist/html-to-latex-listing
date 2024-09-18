#!/usr/bin/env node

import { argv, stderr } from "node:process";
import { toLatexListing } from "../lib/index.mjs";
import { glob as listGlob } from "glob";

import { readFile, writeFile } from "node:fs/promises";

/**
 * @type {(
 *   argv: string[],
 * ) => Promise<number>}
 */
export const main = async (argv) => {
  if (argv.length === 0) {
    stderr.write("Usage: html-to-latex-listing [... <input.html>]\n");
    return 1;
  } else {
    for (const glob of argv) {
      for (const path of await listGlob(glob)) {
        const html = await readFile(path, "utf8");
        const latex = toLatexListing(html);
        if (path.endsWith(".html")) {
          await writeFile(path.substring(0, path.length - 5) + ".tex", latex);
        } else {
          await writeFile(`${path}.tex`, latex);
        }
      }
    }
    return 0;
  }
};

process.exitCode = await main(argv.slice(2));
