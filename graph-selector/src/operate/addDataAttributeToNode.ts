import { getEdgeBreakIndex, getFeaturesIndex } from "../regexps";

import { dataToString } from "./dataToString";
import { getFeatureData } from "../getFeatureData";
import { Descriptor } from "../types";

/**
 * Adds a data attribute to a node
 * or updates the value of an existing data attribute
 */
export function addDataAttributeToNode({
  line,
  name,
  value,
}: {
  line: string;
  name: string;
  value: Descriptor;
}) {
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

  const dataStr = dataToString({ [name]: value });

  if (!features) {
    return indent + edge + line + ` ${dataStr}` + containerStart;
  }

  const { classes, data, id = "" } = getFeatureData(features);

  let newFeatureString = " ";
  if (id) newFeatureString += `#${id}`;
  if (classes) newFeatureString += classes;
  newFeatureString += dataToString({ ...data, [name]: value });

  return indent + edge + line + newFeatureString + containerStart;
}
