import { Graph } from "graph-selector";

export function toCytoscapeElements(parsed: Graph | null) {
  if (!parsed) return [];
  return [
    ...parsed.nodes.map(({ data: { classes, id, label, ...rest } }) => ({
      classes: typeof classes === "string" && classes.split("."),
      data: { id, label, ...rest },
    })),
    ...parsed.edges.map(({ source, target, data }) => {
      const { classes = "", ...rest } = data;
      return {
        classes: classes.split("."),
        data: { source, target, ...rest },
      };
    }),
  ];
}

export function toCytoscapeNodesEdges(parsed: Graph | null) {
  if (!parsed) return { nodes: [], edges: [] };
  return {
    nodes: parsed.nodes.map((node) => ({
      classes:
        typeof node.data.classes === "string" && node.data.classes.split("."),
      data: { id: node.data.id, label: node.data.label },
    })),
    edges: parsed.edges.map(({ source, target, data }) => {
      const { id, label, classes = "" } = data;
      return {
        classes: typeof classes === "string" && classes.split("."),
        data: { id, source, target, label },
      };
    }),
  };
}
