import { useEffect, useRef } from "react";

import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";

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
      },
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
