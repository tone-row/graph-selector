import { Graph } from "graph-selector";

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
