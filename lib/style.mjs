import { isNotNull } from "./util.mjs";

/**
 * @type {(
 *   style: string,
 * ) => Record<string, string>}
 */
export const parseStyle = (style) =>
  Object.fromEntries(style.split(";").map(parseStyleEntry).filter(isNotNull));

/**
 * @type {(
 *   entry: string,
 * ) => [string, string] | null}
 */
const parseStyleEntry = (entry) => {
  const trimmed = entry.trim();
  if (trimmed === "") {
    return null;
  } else {
    const pair = trimmed.split(":");
    if (pair.length !== 2) {
      return null;
    } else {
      return [pair[0].trim().toLowerCase(), pair[1].trim().toLowerCase()];
    }
  }
};
