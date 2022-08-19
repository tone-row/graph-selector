import * as Collapsible from "@radix-ui/react-collapsible";

import { Graph, parse } from "parser";
import { useEffect, useState } from "react";

import { CytoscapeBasic } from "../components/CytoscapeBasic";
import { Editor } from "../components/Editor";

// TODO: add real description for everything
// TODO: add code snippets for everything
// TODO: consider add a "Rendered With" tab to the top of the render window

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

  const elements = parsed
    ? [
        ...parsed.nodes.map((node) => ({
          data: { id: node.id, label: node.label },
        })),
        ...parsed.edges.map((edge) => ({
          data: { id: edge.id, source: edge.source, target: edge.target },
        })),
      ]
    : [];
  return (
    <div className="page">
      <h1>Labels Only</h1>
      <p>
        Using{" "}
        <a href="https://js.cytoscape.org/" target="_blank">
          cytoscape.js
        </a>{" "}
        to render graph. Uses dagre layout.
      </p>
      <Editor
        value={code}
        onChange={(newCode) => newCode && setCode(newCode)}
      />
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
      <CytoscapeBasic elements={elements} />
    </div>
  );
}

export function isError(value: unknown): value is Error {
  return value instanceof Error;
}
