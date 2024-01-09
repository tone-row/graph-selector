import { Graph } from "./types";

type StringifyOptions = {
  /**
   * Whether to compact the output by removing newlines and spaces
   */
  compact?: boolean;
};

const defaultOptions: StringifyOptions = {
  compact: false,
};

/**
 * Convets a graph to graph-selector DSL
 */
export function stringify(graph: Graph, _options: StringifyOptions = defaultOptions) {
  const lines: string[] = [];

  // In compact mode, we will store where edges should be added

  // Loop over nodes
  for (const { data: node } of graph.nodes) {
    // Escape label
    const labelStr = escapeLabel(node.label);

    // Only include ID if it's not the same as the label
    let idStr = "";
    if (node.id !== node.label) {
      idStr = `#${node.id}`;
    }

    // Only include classes if there are any
    let classesStr = "";
    if (node.classes)
      classesStr = node.classes
        .split(" ")
        .map((c) => `.${c}`)
        .join("");

    // Only include data if there is any
    const data = stringifyData(node);

    const features = [idStr, classesStr, data].filter(Boolean).join("");
    const line = [labelStr, features].filter(Boolean).join(" ");
    lines.push(line);

    // get all edges whose source is this node
    const edges = graph.edges.filter((edge) => edge.source === node.id);
    for (const { target, data: edge } of edges) {
      // get target node
      const targetNode = graph.nodes.find((node) => node.data.id === target);
      if (!targetNode) continue;

      let label = escapeLabel(edge.label);

      let id = edge.id;
      if (id && id !== edge.label) {
        id = `#${edge.id}`;
      }

      let classes = "";
      if (edge.classes) {
        classes = edge.classes
          .split(" ")
          .map((c) => `.${c}`)
          .join("");
      }

      const data = stringifyData(edge);

      const features = [id, classes, data].filter(Boolean).join("");
      label = [features, label].filter(Boolean).join(" ");

      // Add a colon if there is a label
      if (label) label = `${label}: `;

      // link by id, if id is not the same as label, else label
      const link =
        targetNode.data.id !== targetNode.data.label
          ? `#${targetNode.data.id}`
          : targetNode.data.label;

      // wrap link in ()
      const wrappedLink = `(${link})`;

      const line = ["  ", label, wrappedLink].filter(Boolean).join("");
      lines.push(line);
    }
  }

  // no empty functions
  return lines.join("\n");
}

/**
 * Convert data in the format Record<string, string | number | boolean> to
 * CSS selector style string, e.g. { foo: "bar", baz: 1, fizz: true } => "[foo=bar][baz=1][fizz]"
 */
export function stringifyData(data: Record<string, string | number | boolean>) {
  return Object.entries(data)
    .map(([key, value]) => {
      if (["id", "label", "classes"].includes(key)) return "";
      if (typeof value === "boolean") return `[${key}]`;
      if (typeof value === "number") return `[${key}=${value}]`;
      if (typeof value === "string") return `[${key}="${value.replace(/"/g, '\\"')}"]`;
      throw new Error(`Invalid data type for property "${key}": ${typeof value}`);
    })
    .filter(Boolean)
    .join("");
}

function escapeLabel(label: string) {
  return (
    label
      // Escape these characters in the label using backslash
      // :, [, ], (, )
      .replace(/[:\[\]\(\)]/g, (c) => `\\${c}`)

      // make sure any newlines are escaped
      .replace(/\n/g, "\\n")
  );
}
