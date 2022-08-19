export type Element = {
  id: string;
  lineNumber: number;
  label: string;
};

export type Node = Record<string, string | number>;

export type Edge = Element & {
  source: string;
  target: string;
};

export type Graph = {
  nodes: Node[];
  edges: Edge[];
};

export type FlatNode = Record<string, string | number>;
