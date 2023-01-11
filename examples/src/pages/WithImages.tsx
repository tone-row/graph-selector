import { Graph, parse, toCytoscapeElements } from "graph-selector";
import { useEffect, useState } from "react";

import { CustomEditor } from "../components/CustomEditor";
import { CyGraph } from "../components/CyGraph";
import { NextExample } from "../components/NextExample";
import { ShowParsed } from "../components/ShowParsed";
import { TitleDescription } from "../components/TitleDescription";
import { isError } from "../utils/isError";

const startingCode = `[src="https://i.ibb.co/N3r6Fy1/Screen-Shot-2023-01-11-at-2-22-31-PM.png"]
  [src="https://i.ibb.co/xgZXHG0/Screen-Shot-2023-01-11-at-2-22-36-PM.png"]
    [src="https://i.ibb.co/k6SgRvb/Screen-Shot-2023-01-11-at-2-22-41-PM.png"]
      [src="https://i.ibb.co/34TTCqM/Screen-Shot-2023-01-11-at-2-22-47-PM.png"]`;

export function WithImages() {
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
        pageTitle="With Images"
        pageDescription={
          <p>
            Different techniques can be used to display images in different
            contexts. This example displays an image if a "src" data attribute
            is passed to a node.
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
            selector: "node[src]",
            style: {
              "background-image": "data(src)",
              "background-fit": "cover",
              "background-width": "100%",
              "background-height": "100%",
              "background-opacity": 0.5,
              shape: "rectangle",
            },
          },
          {
            selector: "node[src][w]",
            style: {
              width: "data(w)",
            },
          },
          {
            selector: "node[src][h]",
            style: {
              height: "data(h)",
            },
          },
        ]}
      />
      <NextExample />
    </div>
  );
}
