import { ElementDefinition } from "cytoscape";
import { Graph } from "./types";

export function toCytoscapeElements(parsed: Graph | null): ElementDefinition[] {
  const elements: ElementDefinition[] = [];
  if (!parsed) return elements;
  for (const { data, parser } of parsed.nodes) {
    const { classes: _classes = "", ...rest } = data;
    const classes = _classes.split(".").join(" ");
    elements.push({
      classes,
      data: {
        lineNumber: parser.lineNumber,
        ...rest,
      },
    });
  }
  for (const { source, target, data, parser } of parsed.edges) {
    const { classes: _classes = "", ...rest } = data;
    const classes = _classes.split(".").join(" ");
    elements.push({
      classes,
      data: {
        lineNumber: parser.lineNumber,
        source,
        target,
        ...rest,
      },
    });
  }
  return elements;
}
