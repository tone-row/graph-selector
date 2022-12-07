import { Graph, parse } from "graph-selector";
import { useEffect, useState } from "react";

import { CyGraph } from "../components/CyGraph";
import { Editor } from "../components/Editor";
import { ErrorBoundary } from "react-error-boundary";
import { NextExample } from "../components/NextExample";
import { ShowParsed } from "../components/ShowParsed";
import { TitleDescription } from "../components/TitleDescription";
import { isError } from "../utils/isError";

const startingCode = `Mercury [size=2439]
  Venus [size=6052]
    Earth [size=6371]
      Mars [size=3390]
        Jupiter [size=69911]
          Saturn [size=58232]
            Uranus [size=25362]
              Neptune [size=24622]`;

export function NodeSize() {
  const [code, setCode] = useState(startingCode);
  const [error, setError] = useState("");
  const [parsed, setParsed] = useState<null | Graph>(null);
  useEffect(() => {
    try {
      setParsed(parse(code));
    } catch (e) {
      setParsed(null);
      if (isError(e)) setError(e.message);
    }
  }, [code]);

  let nodes =
    parsed?.nodes.map(({ data }) => {
      const { id, label, size } = data;
      return {
        data: {
          width:
            (typeof size === "string" ? parseFloat(size) : (size as number)) /
              600 +
            "px",
          id,
          label,
        },
      };
    }) ?? [];
  let edges =
    parsed?.edges.map(({ source, target }) => ({
      data: {
        source,
        target,
      },
    })) ?? [];

  return (
    <div className="page">
      <TitleDescription
        pageTitle="Node Size"
        pageDescription={
          <p>
            Illustrates how we can use data attribute syntax to store data on
            nodes that impacts the graph that is rendered.
          </p>
        }
      />
      <h2>Input</h2>
      <Editor
        h={400}
        value={code}
        onChange={(newCode) => newCode && setCode(newCode)}
      />
      <h2>Output</h2>
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <ShowParsed parsed={parsed} />
      )}
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <div>
            Failed to render: {error.message}{" "}
            <button onClick={resetErrorBoundary}>Reset</button>
          </div>
        )}
        key={code}
      >
        <CyGraph
          elements={[...nodes, ...edges] as any}
          containerStyle={{ backgroundColor: "#000" }}
          style={[
            {
              selector: "node",
              style: {
                width: "data(width)",
                height: "data(width)",
                label: "data(label)",
                backgroundColor: "#fac39a",
                color: "white",
              },
            },
            {
              selector: "edge",
              style: {
                "target-arrow-shape": "triangle",
                width: 1,
                "target-distance-from-node": 10,
                "source-distance-from-node": 10,
                "line-style": "dashed",
                "line-color": "#fff",
                "target-arrow-color": "#fff",
              },
            },
          ]}
        />
      </ErrorBoundary>
      <NextExample />
    </div>
  );
}
