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

  // remove class names
  for (const className of classNames) {
    // need to match class and stop character to avoid partial matching
    const match = new RegExp(`\.${className}(?<stopCharacter>\\.|$| |:|：)`).exec(line);
    // if no match, continue
    if (!match) continue;

    // get the stop character
    const stopCharacter = match.groups?.stopCharacter || "";

    // get the index of the match
    const index = match.index;

    // remove the match up to the stop character
    line = line.slice(0, index) + stopCharacter + line.slice(index + match[0].length);
  }

  // remove trailing whitespace before end of line if it exists
  line = line.replace(/\s*$/, "");

  return indent + edge + line + containerStart;
}
