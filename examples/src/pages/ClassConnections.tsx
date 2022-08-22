import { Graph, parse } from "parser";
import { useEffect, useState } from "react";

import { CytoscapeBasic } from "../components/CytoscapeBasic";
import { Editor } from "../components/Editor";
import { ShowParsed } from "../components/ShowParsed";
import { isError } from "../utils/isError";
import { toCytoscapeElements } from "../utils/toCytoscapeElements";

const startingCode = `.a X
.a Y
.a Z

one to many
  (.a)

.b X
.b Y
.b Z

(.b)
  many to one

.c many to many
.c X
.d Y
.d Z

(.c)
  (.d)`;

export function ClassConnections() {
  const [code, setCode] = useState(startingCode);
  const [error, setError] = useState("");
  const [parsed, setParsed] = useState<null | Graph>(null);
  useEffect(() => {
    try {
      // TODO: fix the Graph type, it's not correct anymore
      setParsed(parse(code) as any);
    } catch (e) {
      setParsed(null);
      if (isError(e)) setError(e.message);
    }
  }, [code]);

  const elements = toCytoscapeElements(parsed);
  return (
    <div className="page">
      <h1>Class Connections</h1>
      <p>
        Using classes to create one-to-many, many-to-one, and many-to-many
        connections
      </p>
      <Editor
        h={400}
        value={code}
        onChange={(newCode) => newCode && setCode(newCode)}
      />
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <ShowParsed parsed={parsed} />
      )}
      <CytoscapeBasic
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
    </div>
  );
}
