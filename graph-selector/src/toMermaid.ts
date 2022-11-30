import { Graph } from "./types";

export function toMermaid({ nodes, edges }: Graph) {
  const styleLines: string[] = [];
  const lines = ["flowchart"];

  function getSafe(s: string) {
    return s.replace(/\s+/g, "_");
  }

  for (const node of nodes) {
    const { id, label } = node.data;
    if (!id) continue;
    const safeId = getSafe(id);

    const before = "[";
    const after = "]";

    lines.push(`\t${safeId}${before}"${getSafeLabel(label) || " "}"${after}`);
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
}

function getSafeLabel(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
