import * as Collapsible from "@radix-ui/react-collapsible";

import { Graph, parse, toCytoscapeElements } from "graph-selector";
import { useEffect, useState } from "react";

import { CustomEditor } from "../components/CustomEditor";
import { CyGraph } from "../components/CyGraph";
import { NextExample } from "../components/NextExample";
import { TitleDescription } from "../components/TitleDescription";

const startingCode = `a\n\tto: b\n\tc\n\t\tgoes to: d\n\nA Container {\n\thello world\n\t\t(b)\n}`;

declare global {
  interface Window {
    monaco: any;
  }
}

export function CreatingEdgesLabels() {
  const [code, setCode] = useState(startingCode);
  const [error, setError] = useState("");
  const [parsed, setParsed] = useState<null | Graph>(null);
  useEffect(() => {
    setError("");
    try {
      setParsed(parse(code));
    } catch (e) {
      setParsed(null);
      console.error(e);
      if (isError(e)) setError(e.message);
    }
  }, [code]);

  const elements = toCytoscapeElements(parsed);
  return (
    <div className="page">
      <TitleDescription
        pageTitle="Edges, Labels, Containers"
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
      <CustomEditor
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
      <CyGraph key={JSON.stringify(elements)} elements={elements as any} />
      <NextExample />
    </div>
  );
}

export function isError(value: unknown): value is Error {
  return value instanceof Error;
}
