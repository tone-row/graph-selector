import { Graph, parse } from "parser";
import { useEffect, useState } from "react";

import { CytoscapeBasic } from "../components/CytoscapeBasic";
import { Editor } from "../components/Editor";
import { NextExample } from "../components/NextExample";
import { ShowParsed } from "../components/ShowParsed";
import { TitleDescription } from "../components/TitleDescription";
import { isError } from "../utils/isError";
import { toCytoscapeElements } from "../utils/toCytoscapeElements";

const startingCode = `[size=2439] Mercury
  [size=6052] Venus
    [size=6371] Earth
      [size=3390] Mars
        [size=69911] Jupiter
          [size=58232] Saturn
            [size=25362] Uranus
              [size=24622] Neptune`;

export function NodeSize() {
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

  let nodes =
    parsed?.nodes.map(({ id, label, size }) => ({
      data: {
        width:
          (typeof size === "string" ? parseFloat(size) : size) / 600 + "px",
        id,
        label,
      },
    })) ?? [];
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
      <CytoscapeBasic
        elements={[...nodes, ...edges] as any}
        style={[
          {
            selector: "node",
            style: {
              width: "data(width)",
              height: "data(width)",
              label: "data(label)",
            },
          },
        ]}
      />
      <NextExample />
    </div>
  );
}
