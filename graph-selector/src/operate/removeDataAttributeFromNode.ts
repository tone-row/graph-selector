import { getEdgeBreakIndex, getFeaturesIndex } from "../regexps";

import { dataToString } from "./dataToString";
import { getFeatureData } from "../getFeatureData";

/**
 * Removes a data attribute from a node by name
 */
export function removeDataAttributeFromNode({ line, name }: { line: string; name: string }) {
  // remove initial indent
  const indent = line.match(/^\s*/)?.[0] || "";
  line = line.replace(/^\s*/, "");

  // remove container start ("{" as last character)
  let containerStart = "";
  if (line.endsWith(" {")) {
    containerStart = " {";
    line = line.slice(0, -2);
  }

  // remove edge
  let edge = "";
  const edgeBreakIndex = getEdgeBreakIndex(line);
  if (edgeBreakIndex !== -1) {
    edge = line.slice(0, edgeBreakIndex + 1);
    line = line.slice(edgeBreakIndex + 1);
  }

  const featuresIndex = getFeaturesIndex(line);
  let features = "";
  if (featuresIndex !== -1) {
    features = line.slice(featuresIndex);
    line = line.slice(0, featuresIndex);
  }

  if (!features) {
    return indent + edge + line + containerStart;
  }

  const { classes, data, id = "" } = getFeatureData(features);

  let newFeatureString = "";
  if (id) newFeatureString += `#${id}`;
  if (classes) newFeatureString += classes;
  delete data[name];
  newFeatureString += dataToString(data);

  return (
    indent + (edge + [line, newFeatureString].filter(Boolean).join(" ") + containerStart).trim()
  );
}
