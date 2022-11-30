import { Graph } from "graph-selector";

export function toCytoscapeElements(parsed: Graph | null) {
  return parsed
    ? [
        ...parsed.nodes.map((node) => ({
          classes:
            typeof node.attributes.classes === "string" &&
            node.attributes.classes.split("."),
          data: { id: node.attributes.id, label: node.attributes.label },
        })),
        ...parsed.edges.map(({ source, target, attributes }) => {
          const { id, label, classes = "" } = attributes;
          return {
            classes: typeof classes === "string" && classes.split("."),
            data: { id, source, target, label },
          };
        }),
      ]
    : [];
}

export function toCytoscapeNodesEdges(parsed: Graph | null) {
  return parsed
    ? {
        nodes: parsed.nodes.map((node) => ({
          classes:
            typeof node.attributes.classes === "string" &&
            node.attributes.classes.split("."),
          data: { id: node.attributes.id, label: node.attributes.label },
        })),
        edges: parsed.edges.map(({ source, target, attributes }) => {
          const { id, label, classes = "" } = attributes;
          return {
            classes: typeof classes === "string" && classes.split("."),
            data: { id, source, target, label },
          };
        }),
      }
    : { nodes: [], edges: [] };
}
