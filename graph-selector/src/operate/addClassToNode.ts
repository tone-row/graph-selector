import { getEdgeBreakIndex, getFeaturesIndex } from "../regexps";

import { Data } from "../types";
import { getFeatureData } from "../getFeatureData";

export function addClassToNode({ line, className }: { line: string; className: string }) {
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
    return indent + edge + line + ` .${className}` + containerStart;
  }

  const { classes, data, id = "" } = getFeatureData(features);

  let newFeatureString = " ";
  if (id) newFeatureString += `#${id}`;
  if (classes) newFeatureString += classes;
  newFeatureString += `.${className}`;
  if (Object.keys(data).length) newFeatureString += dataToString(data);

  return indent + edge + line + newFeatureString + containerStart;
}

/**
 * Converts data object back to string
 * Problems:
 * - Order not guaranteed
 * - Will wrap strings even if they weren't wrapped
 */
function dataToString(data: Data) {
  let dataString = "";
  for (const key in data) {
    const value = data[key];
    dataString += `[${key}`;
    if (value === true) {
      dataString += "]";
      continue;
    } else if (typeof value === "string") {
      // if includes '"', use single quotes
      if (value.includes('"')) {
        dataString += `='${value}']`;
        continue;
      }
      // Will auto-wrap in double quotes
      dataString += `="${value}"]`;
      continue;
    } else if (typeof value === "number") {
      dataString += `=${value}]`;
      continue;
    }
  }
  return dataString;
}
