export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

const WORDS =
  "start review build ship test deploy plan fix design call user api db cache queue retry done fail".split(
    " ",
  );
const CLASSES = ["red", "blue", "green", "warn", "big"];
const EDGE_LABELS = ["yes", "no", "next", "on error", "maybe"];

/** A document shaped like real flowchart.fun input: nested steps, edge labels, ids, classes, references, containers. */
export function realisticDoc(lineCount: number, seed = 1, { referenceRate = 0.12 } = {}): string {
  const r = rng(seed);
  const pick = <T>(xs: T[]) => xs[Math.floor(r() * xs.length)] as T;
  const words = () => Array.from({ length: 1 + Math.floor(r() * 3) }, () => pick(WORDS)).join(" ");
  const lines: string[] = [];
  const ids: string[] = [];
  const labels: string[] = [];
  let depth = 0;
  let containerDepth = 0;
  let nextId = 0;
  while (lines.length < lineCount) {
    const roll = r();
    if (roll < 0.03 && containerDepth < 2 && depth === 0) {
      lines.push(`${words()} {`);
      containerDepth++;
      continue;
    }
    if (roll < 0.06 && containerDepth > 0 && depth === 0) {
      lines.push("}");
      containerDepth--;
      continue;
    }
    if (roll < 0.08) {
      lines.push(`// ${words()}`);
      continue;
    }
    depth = Math.max(0, Math.min(depth + Math.floor(r() * 3) - 1, 6));
    const indent = "  ".repeat(depth);
    const edge = depth > 0 && r() < 0.3 ? `${pick(EDGE_LABELS)}: ` : "";
    if (depth > 0 && r() < referenceRate && ids.length) {
      const p = r();
      const ref = p < 0.6 ? `#${pick(ids)}` : p < 0.95 ? pick(labels) : `.${pick(CLASSES)}`;
      lines.push(`${indent}${edge}(${ref})`);
      continue;
    }
    if (depth === 0 && r() < 0.05 && ids.length) {
      lines.push(`(#${pick(ids)})`);
      continue;
    }
    let label = r() < 0.7 ? `${words()} ${lines.length}` : words();
    labels.push(label);
    if (r() < 0.05) label += " https://example.com/x";
    if (r() < 0.05) label += " \\(escaped\\)";
    let features = "";
    if (r() < 0.25) {
      const id = `s${nextId++}`;
      ids.push(id);
      features += `#${id}`;
    }
    if (r() < 0.25) features += `.${pick(CLASSES)}`;
    if (r() < 0.15) features += `[w=${Math.floor(r() * 100)}]`;
    if (r() < 0.05) features += `[note="${words()}"]`;
    lines.push(`${indent}${edge}${label}${features ? " " + features : ""}`);
  }
  while (containerDepth-- > 0) lines.push("}");
  return lines.join("\n");
}
