import { Graph, Pointer } from "./types";

import { matchAndRemovePointers } from "./matchAndRemovePointers";

// TODO: these types could probably be improved to match the target types (in ./types.ts) more closely

type ID = string;
type UnresolvedEdges = {
  source: ID | Pointer;
  target: ID | Pointer;
  lineNumber: number;
  label: string;
  classes: string;
  id: string;
  data: Record<string, string>;
}[];
type Ancestor = Pointer[] | string | null;
type Ancestors = Ancestor[];

export function parse(text: string): Graph {
  const nodes: Graph["nodes"] = [];
  const edges: Graph["edges"] = [];

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
  const unresolvedEdges: UnresolvedEdges = [];

  for (let line of lines) {
    ++lineNumber;

    // continue from empty line
    if (!line.trim()) continue;

    // get indent size
    const indentSize = getIndentSize(line);

    // check if line is a "source-pointer" (i.e. a reference, like (x), with no indent)
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
    if (line.match(/.+[:：].+/)) {
      const parts = line.split(/[:：]/);
      edgeLabel = parts[0].trim();
      line = parts[1].trim();
    }

    // throw if edge label and no indent
    if (indentSize === 0 && edgeLabel) {
      throw new Error(`Line ${lineNumber}: Edge label without parent`);
    }

    // remove indent from line
    line = line.trim();

    const { classes, data, ...rest } = getIdClassesAtts(line);
    let id = rest.id;
    line = rest.line;

    // parse all pointers
    const [pointers, lineWithPointersRemoved] = matchAndRemovePointers(line);
    line = lineWithPointersRemoved;

    // the lable is what is left after everything is removed
    const label = line;

    const lineDeclaresNode = !!id || !!label || !!classes || Object.keys(data).length > 0;

    // create a unique ID from label
    // if no user-supplied id
    if (lineDeclaresNode && !id) {
      let inc = 1;
      while (nodeIds.includes(label + inc)) ++inc;
      id = label + inc;
    }

    // Throw if id already exists
    if (lineDeclaresNode && nodeIds.includes(id)) {
      throw new Error(`Line ${lineNumber}: Duplicate node id "${id}"`);
    }

    // Store id
    nodeIds.push(id);

    // create node if label is not empty
    if (lineDeclaresNode) {
      nodes.push({
        attributes: {
          label,
          id,
          classes,
          ...data,
        },
        parser: {
          lineNumber,
        },
      });
    }

    // If ancestor, create edge (or unresolvedEdge)
    if (ancestor) {
      // start by getting edge data
      const { line: newLabel, ...edgeData } = getIdClassesAtts(edgeLabel);
      edgeLabel = newLabel;
      if (isId(ancestor)) {
        // Create Edge for the node on this line
        if (lineDeclaresNode) {
          let edgeId = edgeData.id;
          if (!edgeId) {
            edgeId = `${ancestor}-${id}-1`;
          }
          if (edgeIds.includes(edgeId)) {
            throw new Error(`Line ${lineNumber}: Duplicate edge id "${edgeId}"`);
          }
          edgeIds.push(edgeId);
          edges.push({
            source: ancestor,
            target: id,
            parser: {
              lineNumber,
            },
            attributes: {
              id: edgeId,
              label: edgeLabel,
              classes: edgeData.classes,
              ...edgeData.data,
            },
          });
        }

        // add all pointers to future edges
        for (const [pointerType, pointerId] of pointers) {
          unresolvedEdges.push({
            source: ancestor,
            target: [pointerType, pointerId],
            lineNumber,
            label: edgeLabel,
            ...edgeData,
          });
        }
      } else {
        // Ancestor is a pointer array
        // loop over ancestor pointers
        // and create unresolved edges for each
        for (const sourcePointerArray of ancestor) {
          if (lineDeclaresNode) {
            unresolvedEdges.push({
              source: sourcePointerArray,
              target: id,
              lineNumber,
              label: edgeLabel,
              ...edgeData,
            });
          }

          // add all pointers to future edges
          for (const targetPointerArray of pointers) {
            unresolvedEdges.push({
              source: sourcePointerArray,
              target: targetPointerArray,
              lineNumber,
              label: edgeLabel,
              ...edgeData,
            });
          }
        }
      }
    }

    // Update array of ancestors
    ancestors[indentSize] = id;
    ancestors = ancestors.slice(0, indentSize + 1);
  }

  // resolve unresolved edges
  for (const { source, target, lineNumber, label, data, ...rest } of unresolvedEdges) {
    const sourceNodes = isPointerArray(source)
      ? source[0] === "id"
        ? [{ id: source[1] }]
        : getNodesFromPointerArray(nodes, source)
      : nodes.filter((n) => n.attributes.id === source);
    const targetNodes = isPointerArray(target)
      ? target[0] === "id"
        ? [{ id: target[1] }]
        : getNodesFromPointerArray(nodes, target)
      : nodes.filter((n) => n.attributes.id === target);
    if (sourceNodes.length === 0 || targetNodes.length === 0) continue;
    for (const sourceNode of sourceNodes) {
      for (const targetNode of targetNodes) {
        const source = "id" in sourceNode ? sourceNode.id : sourceNode.attributes.id;
        const target = "id" in targetNode ? targetNode.id : targetNode.attributes.id;
        const attributes = {
          ...rest,
          ...data,
          label,
        };

        // Create edge id if not user-supplied
        if (!attributes.id) {
          let inc = 1;
          let edgeId = `${source}-${target}-${inc}`;
          while (edgeIds.includes(edgeId)) {
            ++inc;
            edgeId = `${source}-${target}-${inc}`;
          }
          attributes.id = edgeId;
        }

        if (edgeIds.includes(attributes.id)) {
          throw new Error(`Line ${lineNumber}: Duplicate edge id "${attributes.id}"`);
        }

        edgeIds.push(attributes.id);
        edges.push({
          source,
          target,
          parser: {
            lineNumber,
          },
          attributes,
        });
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

function getNodesFromPointerArray(nodes: Graph["nodes"], [pointerType, value]: Pointer) {
  switch (pointerType) {
    case "id":
      return nodes.filter((node) => node.attributes.id === value);
    case "class":
      return nodes.filter(
        (node) =>
          typeof node.attributes.classes === "string" &&
          node.attributes.classes.split(".").includes(value),
      );
    case "label":
      return nodes.filter((node) => node.attributes.label === value);
  }
}

function isPointerArray(x: unknown): x is Pointer {
  return Array.isArray(x) && x.length === 2;
}

function isId(id: unknown): id is string {
  return typeof id === "string";
}

function getIdClassesAtts(_line: string) {
  let line = _line.slice(0);
  const re =
    /(?<replace>(?<id>#[\w-]+)?(?<classes>(\.[a-zA-Z]{1}[\w-]*)*)?(?<attributes>(\[\w+=\w+\])*))/g;
  let match: RegExpExecArray | null;
  let id = "";
  let classes = "";
  let attributes = "";

  while ((match = re.exec(line)) != null) {
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
  const data: Record<string, string> = {};
  if (attributes) {
    const attrRe = /\[(?<key>\w+)=(?<value>\w+)\]/g;
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = attrRe.exec(attributes)) != null) {
      if (!attrMatch.groups) continue;
      data[attrMatch.groups.key] = attrMatch.groups.value;
    }
  }

  return {
    id,
    classes,
    data,
    line,
  };
}
