import { useEffect, useRef } from "react";

import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
// @ts-ignore
import edgeConnections from "cytoscape-edge-connections";

cytoscape.use(edgeConnections);
cytoscape.use(dagre);

export function CytoscapeBasic({
  elements,
  style = [],
}: {
  elements: cytoscape.ElementDefinition[];
  style?: cytoscape.Stylesheet[];
}) {
  const cy = useRef<cytoscape.Core>();
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    cy.current = cytoscape({
      container: container.current,
      elements,
      layout: {
        name: "dagre",
        spacingFactor: 2,
        // left to right
        rankDir: "LR",
      } as any,
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
        ...style,
      ],
    });
    let current = cy.current;
    // @ts-ignore
    current.edgeConnections({ maxPasses: 10 });

    return () => {
      current.destroy();
    };
  }, [elements, style]);
  return (
    <div
      ref={container}
      className="cytoscape-basic"
      style={{ width: "100%" }}
    />
  );
}
