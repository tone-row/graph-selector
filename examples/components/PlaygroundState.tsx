"use client";

import { useMemo, useState } from "react";
import { parse } from "graph-selector";
import { Editor } from "./Editor";

const defaultCode = `Hello World
 this: goes to this .color_red[n=15]
 (goes to this)
  fun {
    wow
  } /*
tesing a multiline comment
*/
does it work // not really`;

export function PlaygroundState() {
  const [value, setValue] = useState(defaultCode);
  const graph = useMemo(() => {
    try {
      return parse(value);
    } catch (e) {
      console.log(e);
      return { nodes: [], edges: [] };
    }
  }, [value]);
  return (
    <>
      <Editor
        h={500}
        className="shadow w-12"
        value={value}
        onChange={(val) => val && setValue(val)}
      />
      <code style={{ fontSize: 12, maxWidth: "100%", overflow: "auto" }}>
        {JSON.stringify(graph)}
      </code>
    </>
  );
}
