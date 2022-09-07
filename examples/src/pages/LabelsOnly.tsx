import * as Collapsible from "@radix-ui/react-collapsible";

import { GSGraph, parse } from "graph-selector";
import { useEffect, useState } from "react";

import { CytoscapeBasic } from "../components/CytoscapeBasic";
import { Editor } from "../components/Editor";
import { ErrorBoundary } from "react-error-boundary";
import { NextExample } from "../components/NextExample";
import { TitleDescription } from "../components/TitleDescription";
import { toCytoscapeElements } from "../utils/toCytoscapeElements";

const startingCode = `a
e
    (c) (d)
b
c
d
    f
        (a)`;

export function LabelsOnly() {
  const [code, setCode] = useState(startingCode);
  const [error, setError] = useState("");
  const [parsed, setParsed] = useState<null | GSGraph>(null);
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
        pageTitle="Labels and Edges"
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
      <Editor
        value={code}
        onChange={(newCode) => newCode && setCode(newCode)}
      />
      <h2>Output</h2>
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <Collapsible.Root>
          <Collapsible.Trigger>Show Parsed Value</Collapsible.Trigger>
          <Collapsible.Content>
            <pre>
              <code>{JSON.stringify(parsed, null, 2)}</code>
            </pre>
          </Collapsible.Content>
        </Collapsible.Root>
      )}

      <ErrorBoundary
        FallbackComponent={() => <div>Failed to render</div>}
        key={code}
      >
        <CytoscapeBasic elements={elements as any} />
      </ErrorBoundary>
      <NextExample />
    </div>
  );
}

export function isError(value: unknown): value is Error {
  return value instanceof Error;
}
