import { featuresRe } from "./regexps";
import { Data, Descriptor } from "./types";

/**
 * Given a line, it returns the feaures from the line
 */
export function getFeatureData(_line: string) {
  let line = _line.slice(0).trim();
  let match: RegExpExecArray | null;
  let id = "";
  let classes = "";
  let attributes = "";

  while ((match = featuresRe.exec(line)) != null) {
    if (!match.groups) continue;
    if (!match.groups.replace) break;

    // if (match.groups.pointer) pointers.push(match.groups.pointer);
    if (match.groups.id) id = match.groups.id.slice(1);
    if (match.groups.classes) classes = match.groups.classes;
    if (match.groups.attributes) attributes = match.groups.attributes;

    // remove everything from line
    if (match.groups.replace) line = line.replace(match.groups.replace, "").trim();
  }

  // if attributes, parse into data object
  const data: Data = {};
  if (attributes) {
    // We capture the rawValue (possibly with quotes) and the value inside potential quotes
    // to determine if the user wanted it to be parsed as a string or not
    const attrRe =
      /\[(?<key>[^\]=]+)(?<attributeValue>=(?<rawValue>'(?<value1>[^']+)'|"(?<value2>[^"]+)"|(?<value3>[^\]]+)))?\]/g;
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = attrRe.exec(attributes)) != null) {
      if (!attrMatch.groups) continue;
      const key = attrMatch.groups.key;
      if (!key) continue;
      const hasAttributeValue = attrMatch.groups.attributeValue !== undefined;
      // if it doesn't have an attribute value, set to true and move on
      if (!hasAttributeValue) {
        data[key] = true;
        continue;
      }

      let value: Descriptor =
        attrMatch.groups.value1 ?? attrMatch.groups.value2 ?? attrMatch.groups.value3 ?? "";
      const userSuppliedString = attrMatch.groups.rawValue !== value;
      // if value is a number and user didn't supply a string (e.g. [hello=1] instead of [hello="1"])
      // then parse it as a number
      if (!userSuppliedString && !isNaN(Number(value))) {
        value = Number(value);
      }
      data[key] = value;
    }
  }

  return {
    id,
    classes,
    data,
    line,
  };
}
