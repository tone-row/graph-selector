export type GSElement = {
  id: string;
  lineNumber: number;
  label: string;
  classes: string;
};

export type GSNode = GSElement & {
  [key: string]: string | number;
};

export type GSEdge = GSElement & {
  source: string;
  target: string;
  [key: string]: string | number;
};

export type GSGraph = {
  nodes: GSNode[];
  edges: GSEdge[];
};
