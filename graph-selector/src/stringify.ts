import { Graph } from "./types";

/**
 * Convets a graph to graph-selector DSL
 */
export function stringify(graph: Graph) {
  const lines: string[] = [];
  for (const node of graph.nodes) {
    const { label: _label, id: _id, classes: _classes, ..._data } = node.data;

    // Escape label
    const label = escapeLabel(_label);

    // Only include ID if it's not the same as the label
    let id = "";
    if (_id !== _label) {
      id = `#${_id}`;
    }

    // Only include classes if there are any
    let classes = "";
    if (_classes)
      classes = _classes
        .split(" ")
        .map((c) => `.${c}`)
        .join("");

    // Only include data if there is any
    const data = stringifyData(_data);

    const features = [id, classes, data].filter(Boolean).join("");
    const line = [label, features].filter(Boolean).join(" ");
    lines.push(line);

    // get all edges whose source is this node
    const edges = graph.edges.filter((edge) => edge.source === _id);
    for (const edge of edges) {
      // get target node
      const target = graph.nodes.find((node) => node.data.id === edge.target);
      if (!target) continue;

      const { label: edgeLabel, id: edgeId, classes: edgeClasses, ...edgeData } = edge.data;

      let label = escapeLabel(edgeLabel);

      let id = edgeId;
      if (id && id !== edgeLabel) {
        id = `#${edgeId}`;
      }

      let classes = "";
      if (edgeClasses) {
        classes = edgeClasses
          .split(" ")
          .map((c) => `.${c}`)
          .join("");
      }

      const data = stringifyData(edgeData);

      const features = [id, classes, data].filter(Boolean).join("");
      label = [features, label].filter(Boolean).join(" ");

      // Add a colon if there is a label
      if (label) label = `${label}: `;

      // link by id, if id is not the same as label, else label
      const link = target.data.id !== target.data.label ? `#${target.data.id}` : target.data.label;

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
      if (typeof value === "boolean") return `[${key}]`;
      if (typeof value === "number") return `[${key}=${value}]`;
      if (typeof value === "string") return `[${key}="${value.replace(/"/g, '\\"')}"]`;
      throw new Error(`Unsupported data type: ${typeof value}: ${value}`);
    })
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
