import { isNotNull } from "./util.mjs";
import { UnreachableError } from "./error.mjs";

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

// color //

const COLOR_REGEXP = /^#[0-9a-f]{6}$/;

/**
 * @type {(
 *   string: string,
 * ) => string is import("./style").Color}
 */
export const isColor = (string) => COLOR_REGEXP.test(string);

/**
 * @type {(
 *   string: string,
 * ) => asserts string is import("./style").Color}
 */
export const assertColor = (string) => {
  if (!isColor(string)) {
    throw new Error(`invalid color ${JSON.stringify(string)}`);
  }
};

/**
 * @type {(
 *   style: Record<string, string>,
 * ) => null | import("./style").Color}
 */
export const getColor = (style) => {
  if (Object.hasOwn(style, "color")) {
    const color = style.color;
    assertColor(color);
    return color;
  } else {
    return null;
  }
};

/**
 * @type {(
 *   tree: import("./tree").Tree,
 *   color: import("./style").Color | null,
 * ) => import("./tree").Tree}
 */
export const setColor = (tree, color) => {
  if (color === null) {
    return tree;
  } else {
    return ["\\textcolor[HTML]{", color.substring(1), "}{", tree, "}"];
  }
};

// font-weight //

/**
 * @type {(
 *   style: Record<string, string>,
 * ) => "normal" | "bold"}
 */
export const getFontWeight = (style) => {
  if (Object.hasOwn(style, "font-weight")) {
    const font_weight = style["font-weight"];
    if (font_weight === "normal" || font_weight === "bold") {
      return font_weight;
    } else {
      throw new Error(`unexpected font-weight: ${JSON.stringify(font_weight)}`);
    }
  } else {
    return "normal";
  }
};

/**
 * @type {(
 *   tree: import("./tree").Tree,
 *   font_weight: import("./style").FontWeight,
 * ) => import("./tree").Tree}
 */
export const setFontWeight = (tree, font_weight) => {
  switch (font_weight) {
    case "normal": {
      return tree;
    }
    case "bold": {
      return ["\\textbf{", tree, "}"];
    }
    default: {
      throw new UnreachableError(font_weight);
    }
  }
};

// font-style //

/**
 * @type {(
 *   style: Record<string, string>,
 * ) => "normal" | "italic"}
 */
export const getFontStyle = (style) => {
  if (Object.hasOwn(style, "font-style")) {
    const font_style = style["font-style"];
    if (font_style === "normal" || font_style === "italic") {
      return font_style;
    } else {
      throw new Error(`unexpected font-style: ${JSON.stringify(font_style)}`);
    }
  } else {
    return "normal";
  }
};

/**
 * @type {(
 *   tree: import("./tree").Tree,
 *   font_style: import("./style").FontStyle,
 * ) => import("./tree").Tree}
 */
export const setFontStyle = (tree, font_style) => {
  switch (font_style) {
    case "normal": {
      return tree;
    }
    case "italic": {
      return ["\\textit{", tree, "}"];
    }
    default: {
      throw new UnreachableError(font_style);
    }
  }
};

// text-decoration //

/**
 * @type {(
 *   style: Record<string, string>,
 * ) => import("./style").TextDecoration}
 */
export const getTextDecoration = (style) => {
  if (Object.hasOwn(style, "text-decoration")) {
    const text_decoration = style["text-decoration"];
    if (text_decoration.includes("underline")) {
      return "underline";
    } else {
      return "none";
    }
  } else {
    return "none";
  }
};

/**
 * @type {(
 *   tree: import("./tree").Tree,
 *   text_decoration: import("./style").TextDecoration,
 * ) => import("./tree").Tree}
 */
export const setTextDecoration = (tree, text_decoration) => {
  switch (text_decoration) {
    case "none": {
      return tree;
    }
    case "underline": {
      return ["\\uline{", tree, "}"];
    }
    default: {
      throw new UnreachableError(text_decoration);
    }
  }
};
