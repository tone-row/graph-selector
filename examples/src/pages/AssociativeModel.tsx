import { Component, useEffect, useState } from "react";
import { Graph, parse } from "parser";
import {
  toCytoscapeElements,
  toCytoscapeNodesEdges,
} from "../utils/toCytoscapeElements";

import { CytoscapeAssociative } from "../components/CytoscapeAssociative";
import { CytoscapeBasic } from "../components/CytoscapeBasic";
import { Editor } from "../components/Editor";
import { ErrorBoundary } from "react-error-boundary";
import { ShowParsed } from "../components/ShowParsed";
import { TitleDescription } from "../components/TitleDescription";
import { isError } from "../utils/isError";

// TODO: wrap cytoscape in an error boundary

const startingCode = `a
  #fun great: (#test)
b
  #test hello: c
c
  (#fun)`;

export function AssociativeModel() {
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

  const { nodes, edges } = toCytoscapeNodesEdges(parsed);

  return (
    <div className="page">
      <TitleDescription
        pageTitle="Associative Model"
        pageDescription={
          <p>
            This example uses{" "}
            <a href="https://github.com/dmx-systems/cytoscape-edge-connections">
              this cytoscape extension
            </a>{" "}
            to allow for edges to edges. The rendering isn't perfect, but I
            wanted to show that allowing for edge id's now makes this possible.
          </p>
        }
      />
      <h2>Input</h2>
      <Editor
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
      <ErrorBoundary FallbackComponent={() => <div>oops!</div>} key={code}>
        <CytoscapeAssociative
          nodes={nodes as any}
          edges={edges as any}
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
