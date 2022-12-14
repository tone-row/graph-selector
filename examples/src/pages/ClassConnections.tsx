import { Graph, parse } from "graph-selector";
import { useEffect, useState } from "react";

import { CustomEditor } from "../components/CustomEditor";
import { CyGraph } from "../components/CyGraph";
import { NextExample } from "../components/NextExample";
import { ShowParsed } from "../components/ShowParsed";
import { TitleDescription } from "../components/TitleDescription";
import { isError } from "../utils/isError";
import { toCytoscapeElements } from "../utils/toCytoscapeElements";

const startingCode = `X .a
Y .a
Z .a

one to many
  (.a)

X .b
Y .b
Z .b

(.b)
  many to one

many to many .c
X .c
Y .d
Z .d

(.c)
  (.d)`;

export function ClassConnections() {
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

  const elements = toCytoscapeElements(parsed);
  return (
    <div className="page">
      <TitleDescription
        pageTitle="Class Connections"
        pageDescription={
          <p>
            Using classes to create one-to-many, many-to-one, and many-to-many
            connections
          </p>
        }
      />
      <h2>Input</h2>
      <CustomEditor
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
      <CyGraph
        elements={elements as any}
        style={[
          {
            selector: "edge",
            style: { "target-arrow-shape": "triangle", "arrow-scale": 3 },
          },
          {
            selector: ".a",
            style: {
              "background-color": "#f00",
            },
          },
          {
            selector: ".b",
            style: {
              "background-color": "#0f0",
            },
          },
          {
            selector: ".c",
            style: {
              "background-color": "#00f",
            },
          },
          {
            selector: ".d",
            style: {
              "background-color": "#f0f",
            },
          },
        ]}
      />
      <NextExample />
    </div>
  );
}
