import { Graph } from "./types";
import { encode } from "html-entities";

export function toMermaid({ nodes, edges }: Graph) {
  const styleLines: string[] = [];
  const lines = ["flowchart"];

  function getSafe(s: string) {
    return s.replace(/\s+/g, "_");
  }

  /**
   * Push and pop container parents as we traverse the graph
   */
  const parents: string[] = [];

  for (const node of nodes) {
    const { id, label, classes, ...rest } = node.data;
    if (!id) continue;
    const safeId = getSafe(id);

    // end subgraph
    if (parents.length) {
      if (rest.parent !== parents[parents.length - 1]) {
        parents.pop();
        lines.push(`${whitespace()}end`);
      }
    }

    // start subgraph
    if (rest.isParent) {
      lines.push(`${whitespace()}subgraph ${safeId} ["${getSafeLabel(label)}"]`);
      parents.push(safeId);
      continue;
    }

    let before = "[";
    let after = "]";

    // Support shape classes
    if (classes.includes("rounded-rectangle") || classes.includes("roundedrectangle")) {
      before = "(";
      after = ")";
    } else if (classes.includes("ellipse")) {
      before = "([";
      after = "])";
    } else if (classes.includes("circle")) {
      before = "((";
      after = "))";
    } else if (classes.includes("diamond")) {
      before = "{";
      after = "}";
    } else if (classes.includes("hexagon")) {
      before = "{{";
      after = "}}";
    } else if (classes.includes("right-rhomboid")) {
      before = "[/";
      after = "/]";
    } else if (classes.includes("rhomboid")) {
      before = "[\\";
      after = "\\]";
    }

    lines.push(`${whitespace()}${safeId}${before}"${getSafeLabel(label) || " "}"${after}`);
  }

  // Close any open subgraphs
  while (parents.length) {
    parents.pop();
    lines.push(`${whitespace()}end`);
  }

  for (const edge of edges) {
    const { source, target } = edge;
    const { label } = edge.data;
    const safeSource = getSafe(source);
    const safeTarget = getSafe(target);
    const safeLabel = getSafeLabel(label);
    lines.push(`\t${safeSource} -${safeLabel ? `- "${safeLabel}" -` : ""}-> ${safeTarget}`);
  }

  return lines.concat(styleLines).join("\n");

  function whitespace() {
    return Array(parents.length + 1)
      .fill("\t")
      .join("");
  }
}

function getSafeLabel(unsafe: string) {
  return encode(unsafe);
}
