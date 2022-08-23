import { Component, useEffect, useState } from "react";
import { Graph, parse } from "parser";

import { CytoscapeBasic } from "../components/CytoscapeBasic";
import { Editor } from "../components/Editor";
import { ErrorBoundary } from "react-error-boundary";
import { ShowParsed } from "../components/ShowParsed";
import { isError } from "../utils/isError";
import { toCytoscapeElements } from "../utils/toCytoscapeElements";

// TODO: wrap cytoscape in an error boundary

const startingCode = `#a long label text
  (#c)
#b longer label text
  (#c)
#c.large.fantasy the longest label text of all`;

export function IdsClasses() {
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
      <h1>ID's &amp; Classes</h1>
      <p>
        Using{" "}
        <a href="https://js.cytoscape.org/" target="_blank">
          cytoscape.js
        </a>{" "}
        to render graph. Uses dagre layout.
      </p>
      <Editor
        h={180}
        value={code}
        onChange={(newCode) => newCode && setCode(newCode)}
      />
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <ShowParsed parsed={parsed} />
      )}
      <ErrorBoundary FallbackComponent={() => <div>oops!</div>} key={code}>
        <CytoscapeBasic
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
      </ErrorBoundary>
    </div>
  );
}
