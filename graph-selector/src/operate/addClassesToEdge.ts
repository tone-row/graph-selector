import { featuresRe, getEdgeBreakIndex, getFeaturesIndex } from "../regexps";

import { dataToString } from "./dataToString";
import { getFeatureData } from "../getFeatureData";

export function addClassesToEdge({ line, classNames }: { line: string; classNames: string[] }) {
  // remove initial indent
  const indent = line.match(/^\s*/)?.[0] || "";
  line = line.replace(/^\s*/, "");

  // remove container start ("{" as last character)
  let containerStart = "";
  if (line.endsWith(" {")) {
    containerStart = " {";
    line = line.slice(0, -2);
  }

  // pop off edge
  let edge = "";
  const edgeBreakIndex = getEdgeBreakIndex(line);
  if (edgeBreakIndex !== -1) {
    edge = line.slice(0, edgeBreakIndex + 1);
    line = line.slice(edgeBreakIndex + 1);
  }

  // if there's no edge, note it
  const noEdge = !edge;

  // separate features and label
  const startOfFeatures = getFeaturesIndex(edge);
  let features = "";
  if (startOfFeatures === 0) {
    features = featuresRe.exec(edge)?.[0] || "";
    edge = edge.slice(features.length);

    // reset regex
    featuresRe.lastIndex = 0;
  }

  const divider = noEdge ? ": " : "";

  if (!features) {
    const completeEdge = [`.${classNames.join(".")}`, edge.trim()].filter(Boolean).join(" ").trim();
    return indent + completeEdge + divider + line + containerStart;
  }

  // extract features from string
  const { classes, data, id = "" } = getFeatureData(features);

  let newFeatureString = " ";
  if (id) newFeatureString += `#${id}`;
  if (classes) newFeatureString += classes;
  let classNameString = "";
  // for each class in classNames, if it's not already in classes, add it to the new class string
  for (const className of classNames)
    if (!classes.includes(className)) classNameString += `.${className}`;
  newFeatureString += classNameString;
  if (Object.keys(data).length) newFeatureString += dataToString(data);

  const edgeWithFeatures = [newFeatureString.trim(), edge.trim()].filter(Boolean).join(" ").trim();

  return indent + edgeWithFeatures + line + containerStart;
}
