import { getEdgeBreakIndex } from "../regexps";

export function removeClassesFromNode({
  line,
  classNames,
}: {
  /** The line text */
  line: string;
  /** Array of string *without* the dot (.) */
  classNames: string[];
}) {
  // remove initial indent and store
  const indent = line.match(/^\s*/)?.[0] ?? "";
  line = line.replace(/^\s*/, "");

  // check for unescaped colon that's not at the start of the line
  // if it exists, we're dealing with an edge
  let edge = "";
  const edgeBreakIndex = getEdgeBreakIndex(line);
  if (edgeBreakIndex !== -1) {
    edge = line.slice(0, edgeBreakIndex + 1);
    line = line.slice(edgeBreakIndex + 1);
  }

  // remove class names
  for (const className of classNames) {
    line = line.replace(new RegExp(`\.${className}`), "");
  }

  // remove trailing whitespace before end of line if it exists
  line = line.replace(/\s*$/, "");

  return indent + edge + line;
}
