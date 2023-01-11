import { Graph, parse, toCytoscapeElements } from "graph-selector";
import { useEffect, useState } from "react";

import { CustomEditor } from "../components/CustomEditor";
import { CyGraph } from "../components/CyGraph";
import Editor from "@monaco-editor/react";
import { NextExample } from "../components/NextExample";
import { ShowParsed } from "../components/ShowParsed";
import { TitleDescription } from "../components/TitleDescription";
import { isError } from "../utils/isError";

const startingCode = `Container .purple {
  a
    goes to: b
}`;
const startingStyleCode = `
node {
  font-family: "Comic Sans MS";
  label: data(label);
  text-halign: center;
  text-valign: center;
  width: 30;
  height: 30;
  shape: roundrectangle;
  background-color: purple;
  color: white;
}

edge {
  text-background-opacity: 1;
  text-background-color: red;
  text-background-padding: 2px;
  label: data(label);
}

:parent {
  text-valign: top;
  color: black;
}


`;

export function FreeStyle() {
  const [code, setCode] = useState(startingCode);
  const [styleCode, setStyleCode] = useState(startingStyleCode);
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
        pageTitle="Class Connections"
        pageDescription={
          <p>
            Mostly for testing purposes! This page is just a playground for
            testing cytoscape styles along with the graph produced by
            graph-selector.
          </p>
        }
      />
      <h2>Input</h2>
      <CustomEditor
        h={300}
        value={code}
        onChange={(newCode) => newCode && setCode(newCode)}
      />
      <Editor
        language="css"
        value={styleCode}
        onChange={(s) => s && setStyleCode(s)}
        height="300px"
      />
      <h2>Output</h2>
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <ShowParsed parsed={parsed} />
      )}
      <CyGraph elements={elements as any} styleString={styleCode} />
      <NextExample />
    </div>
  );
}
