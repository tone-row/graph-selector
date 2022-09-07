import { GSGraph } from "parser";

export function toCytoscapeElements(parsed: GSGraph | null) {
  return parsed
    ? [
        ...parsed.nodes.map((node) => ({
          classes: typeof node.classes === "string" && node.classes.split("."),
          data: { id: node.id, label: node.label },
        })),
        ...parsed.edges.map(({ id, source, target, label, classes = "" }) => ({
          classes: typeof classes === "string" && classes.split("."),
          data: { id, source, target, label },
        })),
      ]
    : [];
}

export function toCytoscapeNodesEdges(parsed: GSGraph | null) {
  return parsed
    ? {
        nodes: parsed.nodes.map((node) => ({
          classes: typeof node.classes === "string" && node.classes.split("."),
          data: { id: node.id, label: node.label },
        })),
        edges: parsed.edges.map(
          ({ id, source, target, label, classes = "" }) => ({
            classes: typeof classes === "string" && classes.split("."),
            data: { id, source, target, label },
          })
        ),
      }
    : { nodes: [], edges: [] };
}
