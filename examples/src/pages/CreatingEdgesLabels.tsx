import * as Collapsible from "@radix-ui/react-collapsible";

import { Graph, parse } from "graph-selector";
import { useEffect, useState } from "react";

import { CyGraph } from "../components/CyGraph";
import { Editor } from "../components/Editor";
import { ErrorBoundary } from "react-error-boundary";
import { NextExample } from "../components/NextExample";
import { TitleDescription } from "../components/TitleDescription";
import { toCytoscapeElements } from "../utils/toCytoscapeElements";

const startingCode = `Node A\n\tNode B\nthis\n\tgoes to: that`;

export function CreatingEdgesLabels() {
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
        pageTitle="Creating Edges and Labels"
        pageDescription={
          <p>
            This example demonstrates how to create a graph from a text outline
            by turning each line into a node and using indentation to create
            directed edges between nodes. Labels for edges can be added by
            writing text before the colon (:). The example uses cytoscape.js to
            render the graph.
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
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <div>
            Failed to render: {error.message}{" "}
            <button onClick={resetErrorBoundary}>Reset</button>
          </div>
        )}
        key={code}
      >
        <CyGraph key={JSON.stringify(elements)} elements={elements as any} />
      </ErrorBoundary>
      <NextExample />
    </div>
  );
}

export function isError(value: unknown): value is Error {
  return value instanceof Error;
}
