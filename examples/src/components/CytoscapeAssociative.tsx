import { useEffect, useRef } from "react";

import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
// @ts-ignore
import edgeConnections from "cytoscape-edge-connections";

cytoscape.use(edgeConnections);
cytoscape.use(dagre);

export function CytoscapeAssociative({
  nodes,
  edges,
  style = [],
}: {
  nodes: cytoscape.ElementDefinition[];
  edges: cytoscape.ElementDefinition[];
  style?: cytoscape.Stylesheet[];
}) {
  const cy = useRef<cytoscape.Core>();
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    cy.current = cytoscape({
      container: container.current,
      elements: nodes,
      style: [
        // the stylesheet for the graph
        {
          selector: "node",
          style: {
            label: "data(label)",
          },
        },
        {
          selector: "edge",
          style: {
            label: "data(label)",
            "curve-style": "bezier",
            "text-rotation": "autorotate",
          },
        },
        {
          selector: "node.aux-node",
          style: {
            width: 1,
            height: 1,
          },
        },
        ...style,
      ],
    });
    let current = cy.current;
    // @ts-ignore
    let edgeStuff = current.edgeConnections({ maxPasses: 10 });
    for (const edge of edges) {
      edgeStuff.addEdge(edge);
    }

    current.layout({ name: "dagre", spacingFactor: 2 }).run();

    return () => {
      current.destroy();
    };
  }, [nodes, edges, style]);
  return (
    <div
      ref={container}
      className="cytoscape-basic"
      style={{ width: "100%" }}
    />
  );
}
