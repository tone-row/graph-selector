import { Data } from "../types";

/**
 * Converts data object back to string
 * Problems:
 * - Order not guaranteed
 * - Will wrap strings even if they weren't wrapped
 */
export function dataToString(data: Data) {
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
