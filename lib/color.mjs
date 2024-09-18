const COLOR_REGEXP = /^#[0-9a-f]{6}$/;

/**
 * @type {(
 *   string: string,
 * ) => string is import("./color").Color}
 */
export const isColor = (string) => COLOR_REGEXP.test(string);

/**
 * @type {(
 *   string: string,
 * ) => asserts string is import("./color").Color}
 */
export const assertColor = (string) => {
  if (!isColor(string)) {
    throw new Error(`invalid color ${JSON.stringify(string)}`);
  }
};

// /**
//  * @type {(
//  *   color: string,
//  * ) => import("./color").Color}
//  */
// export const parseColor = (color) => {
//   if (COLOR_REGEXP.test(color)) {
//     return /** @type {import("./color").Color} */ (color.substring(1));
//   } else {
//     throw new Error(`invalid color ${JSON.stringify(color)}`);
//   }
// };
