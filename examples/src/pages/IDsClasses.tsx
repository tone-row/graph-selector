import * as Collapsible from "@radix-ui/react-collapsible";

import { Graph, parse } from "parser";
import { useEffect, useState } from "react";

import { CytoscapeBasic } from "../components/CytoscapeBasic";
import { Editor } from "../components/Editor";

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

  const elements: any = parsed
    ? [
        ...parsed.nodes.map((node) => ({
          classes: typeof node.classes === "string" && node.classes.split("."),
          data: {
            id: node.id,
            label: node.label,
          },
        })),
        ...parsed.edges.map((edge) => ({
          data: { id: edge.id, source: edge.source, target: edge.target },
        })),
      ]
    : [];
  return (
    <div className="page">
      <h1>Ids &amp; Classes</h1>
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
      <CytoscapeBasic
        elements={elements}
        style={[
          { selector: ".large", style: { "font-size": "24px" } },
          { selector: ".fantasy", style: { "font-family": "fantasy" } },
        ]}
      />
    </div>
  );
}

export function isError(value: unknown): value is Error {
  return value instanceof Error;
}
