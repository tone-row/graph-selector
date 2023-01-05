import { Graph, parse, toCytoscapeElements } from "graph-selector";
import { useEffect, useState } from "react";

import { CustomEditor } from "../components/CustomEditor";
import { CyGraph } from "../components/CyGraph";
import { NextExample } from "../components/NextExample";
import { ShowParsed } from "../components/ShowParsed";
import { TitleDescription } from "../components/TitleDescription";
import { isError } from "../utils/isError";

const startingCode = `long label text #a
  (#c)
longer label text #b
  (#c)
the longest label text of all #c.large.fantasy`;

export function IdsClasses() {
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
        pageTitle="Ids and Classes"
        pageDescription={
          <p>
            Using{" "}
            <a href="https://js.cytoscape.org/" target="_blank">
              cytoscape.js
            </a>{" "}
            to render graph. Uses dagre layout.
          </p>
        }
      />
      <h2>Input</h2>
      <CustomEditor
        h={180}
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
          { selector: ".large", style: { "font-size": "24px" } },
          {
            selector: ".fantasy",
            style: {
              "font-family": "fantasy",
              color: "hotpink",
              "text-background-color": "orange",
              "text-background-opacity": 0.5,
            },
          },
        ]}
      />
      <NextExample />
    </div>
  );
}
