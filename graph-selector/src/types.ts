/**
 * Label, ID, Classes, or Data Attribute Value
 *
 * *Note:* The word "descriptor" refers to it being a sort of inverse (CSS) Selector, in that we're describing
 * an element rather than selecting one that may exist
 */
export type Descriptor = string | number | boolean;

/**
 * These are the things stored in the document with text (as opposed to edges, which are stored via indentation, etc.)
 *
 * They are stored under "data" in the document
 * e.g., label #id.class1.class2[x=14][cool]
 */
export interface Data {
  [key: string]: Descriptor;
}

/**
 *  The more specific version of attributes with a guarateed id, classes, and label
 *
 *  A "Feature" refers to a node or an edge in the graph, both of which are gauranteed to at least have this data
 */
export interface FeatureData extends Data {
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
  data: FeatureData;
  parser?: Parser;
};

export type Edge = {
  source: string;
  target: string;
  data: FeatureData;
  parser?: Parser;
};

export type Graph = {
  nodes: Node[];
  edges: Edge[];
};

export type PointerType = "id" | "class" | "label";
export type Pointer = [PointerType, string];
