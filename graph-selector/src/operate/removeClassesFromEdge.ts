import { getEdgeBreakIndex, getFeaturesIndex } from "../regexps";

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

  // need to check for start of label
  // if label start is before feature data start, then everything that
  // looks like a feature is actually in the label
  // and we don't have anything to change
  if (edge.trim()) {
    const labelStart = /\w/.exec(edge)?.index ?? -1;
    const featuresStart = getFeaturesIndex(edge);
    if (labelStart < featuresStart) {
      return indent + edge + line + containerStart;
    }
  }

  // remove class names from edge
  for (const className of classNames) {
    // match class and stop character
    const match = new RegExp(`\\.${className}(?<stopCharacter>\\.|$| |:|：|\\[)`).exec(edge);
    // if it's not there, continue
    if (!match) continue;

    // get stop character
    const stopCharacter = match.groups?.stopCharacter || "";

    // get the index of the match
    const index = match.index;

    // remove the match up to the stop character
    edge = edge.slice(0, index) + stopCharacter + edge.slice(index + match[0].length);
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
