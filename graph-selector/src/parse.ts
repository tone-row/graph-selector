import { Data, FeatureData, Graph, Pointer } from "./types";
import { getEdgeBreakIndex, getFeaturesIndex } from "./regexps";

import { getFeatureData } from "./getFeatureData";
import { matchAndRemovePointers } from "./matchAndRemovePointers";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { strip } from "@tone-row/strip-comments";
import { ParseError } from "./ParseError";
import { getIndentSize } from "./getIndentSize";

// TODO: these types could probably be improved to match the target types (in ./types.ts) more closely

type ID = string;
type UnresolvedEdges = {
  source: ID | Pointer;
  target: ID | Pointer;
  lineNumber: number;
  label: string;
  classes: string;
  id: string;
  otherData: Data;
}[];
type Ancestor = Pointer[] | ID | null;
type Ancestors = Ancestor[];

export function parse(text: string): Graph {
  const nodes: Graph["nodes"] = [];
  const edges: Graph["edges"] = [];

  // add a \ before any http:// or https://
  text = text.replace(/(https?:)\/\//g, "$1\\/\\/");

  // break into lines
  let lines = strip(text, { preserveNewlines: true }).split(/\n/g);

  // unescape backslashes in newlines
  lines = lines.map((line: string) => line.replace(/\\n/g, "\n"));

  // start line number count
  let lineNumber = 0;

  // store Ids
  const nodeIds: string[] = [];
  const edgeIds: string[] = [];

  // store ancestors (ids at indent size)
  // Because of containers, we need to keep track of indents at different levels
  // So we will turn this into a stack
  // And always reference the top of the stack
  const allAncestors: Ancestors[] = [[]];

  // store pointer edges to be resolved when all nodes parsed
  const unresolvedEdges: UnresolvedEdges = [];

  // pop container state on and off stack
  const containerParentIds: ID[] = [];

  for (let line of lines) {
    ++lineNumber;

    const originalLine = line;

    // continue from empty line
    if (!line.trim()) continue;

    // if the very last character of the line is an open curly bracket
    // mark it as a container and remove the bracket
    let isContainerStart = false;
    let isContainerEnd = false;
    if (line[line.length - 1] === "{") {
      line = line.slice(0, -1);
      isContainerStart = true;
    }

    // if the first non-whitespace character of the line is a close curly bracket
    // mark it as a container and remove the bracket
    if (/^\s*\}/.test(line)) {
      // just replace the first closing curly bracket
      line = line.replace("}", "");
      isContainerEnd = true;
      containerParentIds.pop();
    }

    // get indent size
    const indentSize = getIndentSize(line);

    // get our relevant set of ancestors to work with indents
    let ancestors = allAncestors[allAncestors.length - 1] || [];

    // check if line is a "source-pointer" (i.e. a reference, like (x), with no indent)
    if (indentSize === 0 && line[0] === "(") {
      // parse pointers
      const [pointers] = matchAndRemovePointers(line);
      // Update array of ancestors
      allAncestors[allAncestors.length - 1] = [pointers];
      continue;
    }

    // get parent if exists
    const ancestor = findParent(indentSize, ancestors);

    // get edge label if parent
    let edgeLabel = "";
    const edgeBreakIndex = getEdgeBreakIndex(line);
    if (edgeBreakIndex > -1) {
      edgeLabel = line.slice(0, edgeBreakIndex + 1);
      line = line.slice(edgeBreakIndex + 2).trim();
    }

    // throw if edge label and no indent
    if (indentSize === 0 && edgeLabel) {
      throw new ParseError(
        `Line ${lineNumber}: Edge label without parent`,
        lineNumber,
        lineNumber,
        0,
        edgeLabel.length + 1,
        "EDGE_LABEL_WITHOUT_PARENT",
      );
    }

    // remove indent from line
    line = line.trim();

    // get index where features (id, classes, data) start
    const featuresIndex = getFeaturesIndex(line);
    const { classes, data, ...rest } = getFeatureData(line.slice(featuresIndex));
    let id = rest.id;
    line = line.slice(0, featuresIndex);

    // parse all pointers
    const [pointers, lineWithPointersRemoved] = matchAndRemovePointers(line);
    line = lineWithPointersRemoved;

    // error if more than one pointer
    if (pointers.length > 1) {
      throw new ParseError(
        `Line ${lineNumber}: Can't create multiple pointers on same line`,
        lineNumber,
        lineNumber,
        0,
        originalLine.length + 1,
        "MULTIPLE_POINTERS_ON_SAME_LINE",
      );
    }

    // the lable is what is left after everything is removed
    let label = line;

    // safe remove escape from characters now
    label = label.replace(/\\([:：\(\)\（\）{}\[\]])/g, "$1").replace(/\\([#\.\/])/g, "$1");

    let lineDeclaresNode = !!id || !!label || !!classes || Object.keys(data).length > 0;

    // Create a ghost node to be the container parent if none given
    if (!lineDeclaresNode && isContainerStart) {
      lineDeclaresNode = true;
      id = `n${lineNumber}`;
    }

    // Throw if line has pointers and also opens container
    if (pointers.length > 0 && isContainerStart) {
      throw new ParseError(
        `Line ${lineNumber}: Can't create pointer and container on same line`,
        lineNumber,
        lineNumber,
        originalLine.length,
        originalLine.length + 1,
        "POINTER_AND_CONTAINER_ON_SAME_LINE",
      );
    }

    // error if line declares node and pointers
    if (lineDeclaresNode && pointers.length > 0) {
      throw new ParseError(
        `Line ${lineNumber}: Can't create node and pointer on same line`,
        lineNumber,
        lineNumber,
        indentSize + 1,
        originalLine.length + 1,
        "NODE_AND_POINTER_ON_SAME_LINE",
      );
    }

    // create a unique ID from line number
    // if no user-supplied id
    if (lineDeclaresNode && !id) {
      id = `n${lineNumber}`;
    }

    // Throw if id already exists
    if (lineDeclaresNode && nodeIds.includes(id)) {
      throw new ParseError(
        `Line ${lineNumber}: Duplicate node id "${id}"`,
        lineNumber,
        lineNumber,
        indentSize + 1,
        originalLine.length + 1,
        "DUPLICATE_NODE_ID",
      );
    }

    // Store id
    nodeIds.push(id);

    // create node if line declares node
    if (lineDeclaresNode) {
      const _data: FeatureData = {
        label,
        id,
        classes,
        ...data,
      };

      // if parent, add isParent flag
      if (isContainerStart) {
        _data.isParent = true;
      }

      const node: Graph["nodes"][number] = {
        data: _data,
        parser: {
          lineNumber,
        },
      };

      // see if there is an active container parent
      const containerParentId = containerParentIds[containerParentIds.length - 1];

      // if container, add parent to data
      if (containerParentId) {
        node.data.parent = containerParentId;
      }

      nodes.push(node);
    }

    // if container, set parent id
    // and add to ancestors
    if (isContainerStart) {
      containerParentIds.push(id);
      allAncestors.push([]);
    }

    // if container end, pop ancestors
    if (isContainerEnd) {
      allAncestors.pop();
    }

    // If ancestor, create edge (or unresolvedEdge)
    if (ancestor) {
      // start by getting edge data
      const { line: newLabel, ...edgeData } = getFeatureData(edgeLabel);
      edgeLabel = newLabel;
      if (isId(ancestor)) {
        // Create Edge for the node on this line
        if (lineDeclaresNode) {
          let edgeId = edgeData.id;
          if (!edgeId) {
            edgeId = `${ancestor}-${id}-1`;
          }
          if (edgeIds.includes(edgeId)) {
            throw new ParseError(
              `Line ${lineNumber}: Duplicate edge id "${edgeId}"`,
              lineNumber,
              lineNumber,
              indentSize + 1,
              // get length of edge id
              indentSize + 1 + edgeId.length + 1,
              "DUPLICATE_EDGE_ID",
            );
          }
          edgeIds.push(edgeId);
          edges.push({
            source: ancestor,
            target: id,
            parser: {
              lineNumber,
            },
            data: {
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
            id: edgeData.id,
            classes: edgeData.classes,
            otherData: edgeData.data,
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
              id: edgeData.id,
              classes: edgeData.classes,
              otherData: edgeData.data,
            });
          }

          // add all pointers to future edges
          for (const targetPointerArray of pointers) {
            unresolvedEdges.push({
              source: sourcePointerArray,
              target: targetPointerArray,
              lineNumber,
              label: edgeLabel,
              id: edgeData.id,
              classes: edgeData.classes,
              otherData: edgeData.data,
            });
          }
        }
      }
    }

    // Update array of ancestors
    if (!lineDeclaresNode) {
      ancestors[indentSize] = pointers;
    } else {
      ancestors[indentSize] = id;
    }
    ancestors = ancestors.slice(0, indentSize + 1);
  }

  // resolve unresolved edges
  for (const { source, target, lineNumber, label, otherData, ...rest } of unresolvedEdges) {
    const sourceNodes = isPointerArray(source)
      ? getNodesFromPointerArray(nodes, edges, source)
      : nodes.filter((n) => n.data.id === source);
    const targetNodes = isPointerArray(target)
      ? getNodesFromPointerArray(nodes, edges, target)
      : nodes.filter((n) => n.data.id === target);
    if (sourceNodes.length === 0 || targetNodes.length === 0) continue;
    for (const sourceNode of sourceNodes) {
      for (const targetNode of targetNodes) {
        const source = sourceNode.data.id;
        const target = targetNode.data.id;
        const data = {
          ...rest,
          ...otherData,
          label,
        };

        // Create edge id if not user-supplied
        if (!data.id) {
          let inc = 1;
          let edgeId = `${source}-${target}-${inc}`;
          while (edgeIds.includes(edgeId)) {
            ++inc;
            edgeId = `${source}-${target}-${inc}`;
          }
          data.id = edgeId;
        }

        if (edgeIds.includes(data.id)) {
          const line = lines[lineNumber - 1];
          if (!line) continue;
          throw new ParseError(
            `Line ${lineNumber}: Duplicate edge id "${data.id}"`,
            lineNumber,
            lineNumber,
            0,
            line.length + 1,
            "DUPLICATE_EDGE_ID",
          );
        }

        edgeIds.push(data.id);
        edges.push({
          source,
          target,
          parser: {
            lineNumber,
          },
          data,
        });
      }
    }
  }

  return {
    nodes,
    edges,
  };
}

function findParent(indentSize: number, ancestors: Ancestors): Ancestor {
  let parent: Ancestor = null;
  let i = indentSize - 1;
  while (!parent && i >= 0) {
    const ancestor = ancestors[i];
    if (ancestor) parent = ancestor;
    i--;
  }
  return parent;
}
/**
 * Returns the nodes or edges that match a given pointer array
 *
 * Note: Because we only resolve unresolved edges once, we can't
 * resolve pointers to edges that haven't been created yet. This is something
 * potentially worth fixing in the future.
 */
function getNodesFromPointerArray(
  nodes: Graph["nodes"],
  edges: Graph["edges"],
  [pointerType, value]: Pointer,
) {
  const entities = [...nodes, ...edges];
  switch (pointerType) {
    case "id":
      return entities.filter((node) => node.data.id === value);
    case "class":
      return entities.filter(
        (node) =>
          typeof node.data.classes === "string" && node.data.classes.split(".").includes(value),
      );
    case "label":
      return entities.filter((node) => node.data.label === value);
  }
}

function isPointerArray(x: unknown): x is Pointer {
  return Array.isArray(x) && x.length === 2;
}

function isId(id: unknown): id is string {
  return typeof id === "string";
}
