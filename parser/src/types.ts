export type Element = {
  id: string;
  lineNumber: number;
  label: string;
};

export type Node = Record<string, string>;

export type Edge = Element & {
  source: string;
  target: string;
};

export type Graph = {
  nodes: FlatNode[];
  edges: FlatNode[];
};

export type FlatNode = Record<string, string | number>;
