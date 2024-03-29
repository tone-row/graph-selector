import { getEdgeBreakIndex, getFeaturesIndex } from "../regexps";

import { dataToString } from "./dataToString";
import { getFeatureData } from "../getFeatureData";

export function addClassesToNode({ line, classNames }: { line: string; classNames: string[] }) {
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
    return indent + edge + line + ` .${classNames.join(".")}` + containerStart;
  }

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

  return indent + edge + line + newFeatureString + containerStart;
}
