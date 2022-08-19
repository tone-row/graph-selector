import { FlatNode } from "./types";

// TODO: handle pointer-relations where you use a pointer with no indentation to describe a many-to-one or many-to-many relationship
// TODO: parse edge info from <>
// TODO: should data attributes be parsable as number
// TODO: does a node really need a label to be a node?

type PointerType = "id" | "class" | "label";
type PointerArray = [PointerType, string];
type PointerEdges = [string | PointerArray, string | PointerArray][];
type Ancestor = PointerArray[] | string | null;
type Ancestors = Ancestor[];

export function parse(text: string) {
  // TODO: change these back to correct types
  const nodes: FlatNode[] = [];
  const edges: any[] = [];

  // break into lines
  const lines = text.split(/\n/g);

  // start line number count
  let lineNumber = 0;

  // store Ids
  const nodeIds: string[] = [];
  const edgeIds: string[] = [];

  // store ancestors (ids at indent size)
  let ancestors: Ancestors = [];

  // store pointer edges to be resolved when all nodes parsed
  const unresolvedEdges: PointerEdges = [];

  for (let line of lines) {
    ++lineNumber;
    // get indent size
    const indentSize = getIndentSize(line);

    // check if line is a source-pointer
    if (indentSize === 0 && line[0] === "(") {
      // parse pointers
      const [pointers] = matchAndRemovePointers(line);
      // Update array of ancestors
      ancestors[indentSize] = pointers;
      ancestors = ancestors.slice(0, indentSize + 1);
      continue;
    }

    // get parent if exists
    const ancestor = findParent(indentSize, ancestors);

    // get edge label if parent
    let edgeLabel = "";
    if (line.match(/.+:.+/)) {
      const [_edgeLabel, _line] = line.split(":");
      edgeLabel = _edgeLabel.trim();
      line = _line;
    }

    // remove indent from line
    line = line.trim();

    const re =
      /(?<replace>(?<id>#[\w-]+)?(?<classes>(\.[a-zA-Z]{1}[\w-]*)*)?(?<attributes>(\[\w+=\w+\])*)) \w/g;
    let match: RegExpExecArray | null;
    let id = "";
    let classes = "";
    let attributes = "";

    while ((match = re.exec(line)) != null) {
      if (!match.groups) continue;
      // if (match.groups.pointer) pointers.push(match.groups.pointer);
      if (match.groups.id) id = match.groups.id.slice(1);
      if (match.groups.classes) classes = match.groups.classes;
      if (match.groups.attributes) attributes = match.groups.attributes;

      // remove everything from line
      if (match.groups.replace) line = line.replace(match.groups.replace, "").trim();
    }

    // if attributes, parse into data object
    const data: Record<string, string> = {};
    if (attributes) {
      const attrRe = /\[(?<key>\w+)=(?<value>\w+)\]/g;
      let attrMatch: RegExpExecArray | null;
      while ((attrMatch = attrRe.exec(attributes)) != null) {
        if (!attrMatch.groups) continue;
        data[attrMatch.groups.key] = attrMatch.groups.value;
      }
    }

    // parse all pointers
    const [pointers, lineWithPointersRemoved] = matchAndRemovePointers(line);
    line = lineWithPointersRemoved;

    // the lable is what is left after everything is removed
    const label = line;

    // create a unique ID from label
    // if no user-supplied id
    if (!id) {
      let inc = 1;
      while (nodeIds.includes(label + inc)) ++inc;
      id = label + inc;
      nodeIds.push(id);
    }

    // create node if label is not empty
    if (label) {
      const node: FlatNode = {
        lineNumber,
        label,
        id,
        classes,
        ...data,
      };

      nodes.push(node);
    }

    const lineHasNode = !!label;

    // Create edge or unresolvedEdge if ancestor
    if (ancestor) {
      if (isId(ancestor)) {
        // Create Edge for the node on this line
        if (lineHasNode) {
          let inc = 1;
          let edgeId = `${ancestor}-${id}-${inc}`;
          while (edgeIds.includes(edgeId)) {
            ++inc;
            edgeId = `${ancestor}-${id}-${inc}`;
          }
          const edge = {
            id: edgeId,
            lineNumber,
            source: ancestor,
            target: id,
            label: edgeLabel,
          };
          edges.push(edge);
        }

        // add all pointers to future edges
        for (const [pointerType, pointerId] of pointers) {
          unresolvedEdges.push([ancestor, [pointerType, pointerId]]);
        }
      } else {
        // loop over ancestor pointers
        for (const sourcePointerArray of ancestor) {
          // get node
          // const sourceNodes = getNodesFromPointerArray(nodes, sourcePointerArray);
          // if (!sourceNodes) continue;

          if (lineHasNode) {
            unresolvedEdges.push([sourcePointerArray, id]);
          }

          // add all pointers to future edges
          for (const targetPointerArray of pointers) {
            unresolvedEdges.push([sourcePointerArray, targetPointerArray]);
          }
        }
      }
    }

    // Update array of ancestors
    ancestors[indentSize] = id;
    ancestors = ancestors.slice(0, indentSize + 1);
  }

  // resolve unresolved edges
  for (const [source, target] of unresolvedEdges) {
    const sourceNodes = isPointerArray(source)
      ? getNodesFromPointerArray(nodes, source)
      : nodes.filter((n) => n.id === source);
    const targetNodes = isPointerArray(target)
      ? getNodesFromPointerArray(nodes, target)
      : nodes.filter((n) => n.id === target);
    if (sourceNodes.length === 0 || targetNodes.length === 0) continue;
    for (const sourceNode of sourceNodes) {
      for (const targetNode of targetNodes) {
        const edge = {
          id: `${sourceNode.id}-${targetNode.id}`,
          lineNumber,
          source: sourceNode.id,
          target: targetNode.id,
          label: target[0],
        };
        edges.push(edge);
      }
    }
  }

  return {
    nodes,
    edges,
  };
}

function getIndentSize(line: string) {
  const match = line.match(/^\s*/);
  return match ? match[0].length : 0;
}

function findParent(indentSize: number, ancestors: Ancestors): Ancestor {
  let parent: Ancestor = null;
  let i = indentSize - 1;
  while (!parent && i >= 0) {
    parent = ancestors[i];
    i--;
  }
  return parent;
}

function getNodesFromPointerArray(nodes: FlatNode[], [pointerType, value]: PointerArray) {
  switch (pointerType) {
    case "id":
      return nodes.filter((node) => node.id === value);
    case "class":
      return nodes.filter(
        (node) => typeof node.classes === "string" && node.classes.split(".").includes(value),
      );
    case "label":
      return nodes.filter((node) => node.label === value);
  }
}

function isPointerArray(x: unknown): x is PointerArray {
  return Array.isArray(x) && x.length === 2;
}

function matchAndRemovePointers(line: string): [PointerArray[], string] {
  // parse all pointers
  const pointerRe =
    /(?<replace>\((?<pointer>((?<id>#[\w-]+)|(?<class>.[\w]+)|(?<label>[\w\s]+)))\))/g;
  let pointerMatch: RegExpExecArray | null;
  const pointers: PointerArray[] = [];
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

function isId(id: unknown): id is string {
  return typeof id === "string";
}
