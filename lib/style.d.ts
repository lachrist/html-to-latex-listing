/**
 * Color formatted as: #RRGGBB
 * Example: #FF0000 is red
 */
export type Color = string & { __brand: "Color" };

export type FontWeight = "normal" | "bold";

export type FontStyle = "normal" | "italic";

export type TextDecoration = "none" | "underline";
