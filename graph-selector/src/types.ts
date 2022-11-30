/**
 * Label, ID, Classes, or Data Attribute Value
 */
export type Attribute = string | number | boolean;

/**
 * These are the things stored in the document with text (as opposed to edges, which are stored via indentation, etc.)
 *
 * e.g., label #id.class1.class2[x=14][cool]
 */
export interface Attributes {
  [key: string]: Attribute;
}

/**
 *  The more specific version of attributes with a guarateed id, classes, and label
 */
export interface GuarateedAttributes extends Attributes {
  id: string;
  classes: string;
  label: string;
}

/**
 * Data that is a result of parsing the document
 */
export type Parser = {
  lineNumber: number;
};

export type Node = {
  attributes: GuarateedAttributes;
  parser?: Parser;
};

export type Edge = {
  source: string;
  target: string;
  attributes: GuarateedAttributes;
  parser?: Parser;
};

export type Graph = {
  nodes: Node[];
  edges: Edge[];
};

export type PointerType = "id" | "class" | "label";
export type Pointer = [PointerType, string];
