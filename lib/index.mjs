import { parse } from "node-html-parser";
import { joinTree } from "./tree.mjs";
import { ParseError } from "./error.mjs";
import { parseStyle } from "./style.mjs";
import { assertColor } from "./color.mjs";

/**
 * @type {(
 *   node: import("node-html-parser").Node,
 * ) => asserts node is import("node-html-parser").HTMLElement}
 */
const assertElement = (node) => {
  if (node.nodeType !== 1) {
    throw new ParseError("expected node to be an element", node);
  }
};

/**
 * @type {(
 *   node: import("node-html-parser").Node,
 * ) => asserts node is import("node-html-parser").TextNode}
 */
const assertText = (node) => {
  if (node.nodeType !== 3) {
    throw new ParseError("expected node to be text", node);
  }
};

/**
 * @type {(
 *   html: string,
 * ) => string}
 */
export const toLatexListing = (html) => {
  const node = parse(html);
  assertElement(node);
  if (node.tagName !== null) {
    throw new ParseError("expected an array of root element", node);
  }
  if (node.childNodes.length !== 2) {
    throw new ParseError("expected exactly two root elements", node);
  }
  return joinTree([
    visitHead(node.childNodes[0]),
    visitBody(node.childNodes[1]),
  ]);
};

/**
 * @type {(
 *   node: import("node-html-parser").Node,
 * ) => import("./tree").Tree}
 */
const visitHead = (node) => {
  assertElement(node);
  if (node.tagName.toLowerCase() !== "meta") {
    throw new ParseError("expected head node to be a <meta> element", node);
  }
  return "";
};

/**
 * @type {(
 *   style: Record<string, string>,
 * ) => null | import("./color").Color}
 */
const getColor = (style) => {
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
 *   element: import("node-html-parser").Node,
 * ) => import("./tree").Tree}
 */
const visitBody = (node) => {
  assertElement(node);
  if (node.tagName.toLowerCase() !== "div") {
    throw new ParseError("expected body node to be a <div> element");
  }
  const { attributes } = node;
  const style = Object.hasOwn(attributes, "style")
    ? parseStyle(attributes.style)
    : {};
  const color = getColor(style);
  return node.childNodes.map(visitLine);
  // return [
  //   "\\begin{Verbatim}[",
  //   [
  //     "commandchars=\\@\\{\\}",
  //     ...(background_color === null
  //       ? []
  //       : [`fillcolor=\\color[HTML]{${background_color.substring(1)}}`]),
  //     ...(color === null
  //       ? []
  //       : [`fontcolor=\\color[HTML]{${color.substring(1)}}`]),
  //   ].join(","),
  //   "]\n",
  //   node.childNodes.map(visitLine),
  //   "\\end{Verbatim}",
  // ];
};

/**
 * @type {(
 *   node: import("node-html-parser").Node,
 * ) => import("./tree").Tree}
 */
const visitLine = (node) => {
  assertElement(node);
  switch (node.tagName.toLowerCase()) {
    case "div": {
      return [node.childNodes.map(visitToken), "\n"];
    }
    case "br": {
      return "\n";
    }
    default: {
      throw new ParseError(
        "unexpected line node to be either a <div> or a <br> element",
        node,
      );
    }
  }
};

/**
 * @type {(
 *   node: import("node-html-parser").Node,
 * ) => import("./tree").Tree}
 */
const visitToken = (node) => {
  assertElement(node);
  if (node.tagName.toLowerCase() !== "span") {
    throw new ParseError("expected token node to be a span element", node);
  }
  const style = Object.hasOwn(node.attributes, "style")
    ? parseStyle(node.attributes.style)
    : {};
  const color = getColor(style);
  if (color === null) {
    return node.childNodes.map(visitText);
  } else {
    return [
      "\\textcolor[HTML]{",
      color.substring(1),
      "}{",
      node.childNodes.map(visitText),
      "}",
    ];
  }
};

/**
 * @type {(
 *   char: string
 * ) => string}
 */
const escape = (char) => {
  switch (char) {
    case "{": {
      return "\\{";
    }
    case "}": {
      return "\\}";
    }
    case "\\": {
      return `\\textbackslash{}`;
    }
    default: {
      throw new Error(`unexpected character ${JSON.stringify(char)}`);
    }
  }
};

const ESCAPE_REGEXP = /[\\\{\}]/gu;

/**
 * @type {(
 *   node: import("node-html-parser").Node,
 * ) => import("./tree").Tree}
 */
const visitText = (node) => {
  assertText(node);
  return node.text.replaceAll(ESCAPE_REGEXP, escape);
};
