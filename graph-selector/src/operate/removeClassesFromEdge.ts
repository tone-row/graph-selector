import { getEdgeBreakIndex } from "../regexps";

export function removeClassesFromEdge({
  line,
  classNames,
}: {
  /** The line text */
  line: string;
  /** Array of string *without* the dot (.) */
  classNames: string[];
}) {
  // remove initial indent and store
  const indent = line.match(/^\s*/)?.[0];
  line = line.replace(/^\s*/, "");

  // remove container start ("{" as last character)
  let containerStart = "";
  if (line.endsWith(" {")) {
    containerStart = " {";
    line = line.slice(0, -2);
  }

  // check for unescaped colon that's not at the start of the line
  // if it exists, we're dealing with an edge
  let edge = "";
  const edgeBreakIndex = getEdgeBreakIndex(line);
  if (edgeBreakIndex !== -1) {
    edge = line.slice(0, edgeBreakIndex + 1);
    line = line.slice(edgeBreakIndex + 1);
  }

  // remove class names from edge
  for (const className of classNames) {
    edge = edge.replace(new RegExp(`\.${className}`), "");
  }

  // remove leading whitespace before beginning of line if it exists
  edge = edge.replace(/^\s*/, "");

  // if the edge is empty and the line begins with a colon,
  if (edge === "" && line.startsWith(":")) {
    // remove the colon and whitespace
    line = line.replace(/^[:：]\s*/, "");
  }

  return indent + edge + line + containerStart;
}
