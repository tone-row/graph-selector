import { ElementDefinition } from "cytoscape";
import { Graph } from "./types";

export function toCytoscapeElements(parsed: Graph | null): ElementDefinition[] {
  const elements: ElementDefinition[] = [];
  if (!parsed) return elements;
  for (const { data } of parsed.nodes) {
    const { classes: _classes = "", ...rest } = data;
    const classes = _classes.split(".").join(" ");
    elements.push({
      classes,
      data: { ...rest },
    });
  }
  for (const { source, target, data } of parsed.edges) {
    const { classes: _classes = "", ...rest } = data;
    const classes = _classes.split(".").join(" ");
    elements.push({
      classes,
      data: { source, target, ...rest },
    });
  }
  return elements;
}
