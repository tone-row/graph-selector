"use client";

import { useMemo, useState } from "react";
import { parse } from "graph-selector";
import { Editor } from "./Editor";

export function PlaygroundState() {
  const [value, setValue] = useState("Hello World");
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
