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
type ContainerReferences = { containerId: ID; pointer: Pointer }[];

export function parse(text: string): Graph {
  const nodes: Graph["nodes"] = [];
  const edges: Graph["edges"] = [];
  // keyed on data.id, which a [id=...] attribute can override after the line id is chosen
  const nodesById = new Map<ID, Graph["nodes"]>();

  // add a \ before any http:// or https://
  text = text.replace(/(https?:)\/\//g, "$1\\/\\/");

  // break into lines
  let lines = strip(text, { preserveNewlines: true }).split(/\n/g);

  // unescape backslashes in newlines
  lines = lines.map((line: string) => line.replace(/\\n/g, "\n"));

  // start line number count
  let lineNumber = 0;

  // store Ids
  const nodeIds = new Set<string>();
  const edgeIds = new Set<string>();

  // store ancestors (ids at indent size)
  // Because of containers, we need to keep track of indents at different levels
  // So we will turn this into a stack
  // And always reference the top of the stack
  const allAncestors: Ancestors[] = [[]];

  // store pointer edges to be resolved when all nodes parsed
  const unresolvedEdges: UnresolvedEdges = [];

  // pop container state on and off stack
  const containerParentIds: ID[] = [];

  const containerReferences: ContainerReferences = [];

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
    const ancestors = allAncestors[allAncestors.length - 1] || [];

    // check if line is a "source-pointer" (i.e. a reference, like (x), with no indent)
    if (indentSize === 0 && line[0] === "(") {
      // parse pointers
      const [pointers] = matchAndRemovePointers(line);
      const containerId = containerParentIds[containerParentIds.length - 1];
      if (containerId) {
        for (const pointer of pointers) containerReferences.push({ containerId, pointer });
      }
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
    if (label.includes("\\")) {
      label = label.replace(/\\([:：\(\)\（\）{}\[\]])/g, "$1").replace(/\\([#\.\/])/g, "$1");
    }

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
    if (lineDeclaresNode && nodeIds.has(id)) {
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
    nodeIds.add(id);

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
      if (isId(node.data.id)) {
        const sameId = nodesById.get(node.data.id);
        if (sameId) sameId.push(node);
        else nodesById.set(node.data.id, [node]);
      }
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
          if (edgeIds.has(edgeId)) {
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
          edgeIds.add(edgeId);
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

    const containerId = containerParentIds[containerParentIds.length - 1];
    const isTopLevelReference = !lineDeclaresNode && !ancestor;
    if (isTopLevelReference && containerId) {
      for (const pointer of pointers) containerReferences.push({ containerId, pointer });
    }

    // Update array of ancestors
    if (!lineDeclaresNode) {
      ancestors[indentSize] = pointers;
    } else {
      ancestors[indentSize] = id;
    }
    ancestors.length = indentSize + 1;
  }

  // resolve unresolved edges
  // Pointers match nodes first, then edges, each in creation order,
  // including edges created earlier in this loop.
  const index = new PointerIndex();
  for (const node of nodes) index.add(node);
  for (const edge of edges) index.add(edge);
  for (const { source, target, lineNumber, label, otherData, ...rest } of unresolvedEdges) {
    const sourceNodes = isPointerArray(source) ? index.get(source) : (nodesById.get(source) ?? []);
    const targetNodes = isPointerArray(target) ? index.get(target) : (nodesById.get(target) ?? []);
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
          while (edgeIds.has(edgeId)) {
            ++inc;
            edgeId = `${source}-${target}-${inc}`;
          }
          data.id = edgeId;
        }

        if (edgeIds.has(data.id)) {
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

        edgeIds.add(data.id);
        const edge = {
          source,
          target,
          parser: {
            lineNumber,
          },
          data,
        };
        edges.push(edge);
        index.add(edge);
      }
    }
  }

  for (const { containerId, pointer } of containerReferences) {
    const containerAndAncestors: ID[] = [];
    let id: unknown = containerId;
    while (isId(id) && !containerAndAncestors.includes(id)) {
      containerAndAncestors.push(id);
      id = nodesById.get(id)?.[0]?.data.parent;
    }
    for (const target of getNodesFromPointerArray(nodes, pointer)) {
      if (containerAndAncestors.includes(target.data.id)) continue;
      const parent = target.data.parent;
      const inUnrelatedContainer = isId(parent) && !containerAndAncestors.includes(parent);
      if (inUnrelatedContainer) continue;
      target.data.parent = containerId;
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
type Entity = Graph["nodes"][number] | Graph["edges"][number];

/** Entities grouped by each value a pointer can match, in the order they were added. */
class PointerIndex {
  private byId = new Map<string, Entity[]>();
  private byClass = new Map<string, Entity[]>();
  private byLabel = new Map<string, Entity[]>();

  add(entity: Entity) {
    const { id, classes, label } = entity.data;
    if (typeof id === "string") addTo(this.byId, id, entity);
    if (typeof label === "string") addTo(this.byLabel, label, entity);
    if (typeof classes === "string") {
      for (const c of classes.split(".")) if (c) addTo(this.byClass, c, entity);
    }
  }

  /** A copy, so entities added while the caller iterates are not seen. */
  get([pointerType, value]: Pointer): Entity[] {
    const bucket =
      pointerType === "id" ? this.byId : pointerType === "class" ? this.byClass : this.byLabel;
    return bucket.get(value)?.slice() ?? [];
  }
}

function addTo<T>(map: Map<string, T[]>, key: string, value: T) {
  const bucket = map.get(key);
  if (!bucket) map.set(key, [value]);
  else if (bucket[bucket.length - 1] !== value) bucket.push(value);
}

/** Returns the nodes that match a given pointer array */
function getNodesFromPointerArray(nodes: Graph["nodes"], [pointerType, value]: Pointer) {
  switch (pointerType) {
    case "id":
      return nodes.filter((node) => node.data.id === value);
    case "class":
      return nodes.filter(
        (node) =>
          typeof node.data.classes === "string" && node.data.classes.split(".").includes(value),
      );
    case "label":
      return nodes.filter((node) => node.data.label === value);
  }
}

function isPointerArray(x: unknown): x is Pointer {
  return Array.isArray(x) && x.length === 2;
}

function isId(id: unknown): id is string {
  return typeof id === "string";
}
