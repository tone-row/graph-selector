import { Pointer } from "./types";

export function matchAndRemovePointers(line: string): [Pointer[], string] {
  // parse all pointers
  const pointerRe =
    /(?<replace>(^|[^\\])[(（](?<pointer>((?<id>#[\w-]+)|(?<class>\.[a-zA-Z]{1}[\w]*)|(?<label>[^)）]+)))[)）])/g;
  let pointerMatch: RegExpExecArray | null;
  const pointers: Pointer[] = [];
  let lineWithPointersRemoved = line.slice(0);
  while ((pointerMatch = pointerRe.exec(line)) != null) {
    if (!pointerMatch.groups) continue;
    if (pointerMatch.groups.pointer) {
      if (pointerMatch.groups.id) {
        pointers.push(["id", pointerMatch.groups.id.slice(1)]);
      } else if (pointerMatch.groups.class) {
        pointers.push(["class", pointerMatch.groups.class.slice(1)]);
      } else if (pointerMatch.groups.label) {
        pointers.push(["label", pointerMatch.groups.label]);
      }
    }
    // remove everything from line
    if (pointerMatch.groups.replace)
      lineWithPointersRemoved = lineWithPointersRemoved
        .replace(pointerMatch.groups.replace, "")
        .trim();
  }
  return [pointers, lineWithPointersRemoved];
}
