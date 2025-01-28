import cytoscape, { CytoscapeOptions, ElementDefinition } from "cytoscape";
import { useEffect, useRef, useState } from "react";

import dagre from "cytoscape-dagre";
import edgeConnections from "cytoscape-edge-connections";
import { toCytoscapeElements } from "graph-selector";

cytoscape.use(edgeConnections);
cytoscape.use(dagre);

export function CytoscapeGraph({
  elements,
  style = [],
  containerStyle = {},
}: {
  elements: ReturnType<typeof toCytoscapeElements>;
  style?: cytoscape.StylesheetStyle[];
  containerStyle?: React.CSSProperties;
}) {
  const cy = useRef<cytoscape.Core>();
  const cyError = useRef<cytoscape.Core>();
  const container = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    setError("");
    try {
      let options = {
        elements,
        layout: {
          // @ts-ignore
          name: "dagre",
          // @ts-ignore
          spacingFactor: 2,
          rankDir: "LR",
        },
        style: [
          {
            selector: "node",
            style: {
              label: "data(label)",
              "text-wrap": "wrap",
            },
          },
          {
            selector: "edge",
            style: {
              label: "data(label)",
              "curve-style": "bezier",
              "text-rotation": "autorotate",
              "target-arrow-shape": "triangle",
            },
          },
          {
            selector: ".large",
            style: {
              "font-size": "24px",
            },
          },
          {
            selector: ".small",
            style: {
              "font-size": "12px",
            },
          },
          {
            selector: ":parent",
            style: {
              "background-opacity": 0.333,
              "text-valign": "top",
              "text-halign": "center",
              "text-margin-y": -10,
            },
          },
          ...style,
        ],
      } as CytoscapeOptions;
      // test with error first
      cyError.current = cytoscape({ ...options, headless: true });
      let cyE = cyError.current;

      // if that works, then do it for real
      cy.current = cytoscape({ ...options, container: container.current });
      let cyC = cy.current;

      // destroy both
      return () => {
        cyC?.destroy();
        cyE?.destroy();
      };
    } catch (e) {
      console.error(e);
      setError((e as Error).message);
      return () => {
        cyError.current?.destroy();
      };
    }
  }, [elements, style]);
  return (
    <>
      {error && <div className="error">{error}</div>}
      <div
        ref={container}
        className="cytoscape-basic h-64 rounded border-2 border-gray-200"
        style={{ width: "100%", ...containerStyle }}
      />
    </>
  );
}
