import { Graph } from "parser";

export function toCytoscapeElements(parsed: Graph | null) {
  return parsed
    ? [
        ...parsed.nodes.map((node) => ({
          classes: typeof node.classes === "string" && node.classes.split("."),
          data: { id: node.id, label: node.label },
        })),
        ...parsed.edges.map(({ id, source, target, label }) => ({
          data: { id, source, target, label },
        })),
      ]
    : [];
}
