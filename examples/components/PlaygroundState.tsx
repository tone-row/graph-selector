"use client";

import { useMemo, useState } from "react";
import { highlight, parse } from "graph-selector";
import { Editor } from "./Editor";

const defaultCode = `Welcome to Flowchart Fun!
  Start: Modify text to see it transform into a flowchart on the right.
  Understand Syntax .shape_circle
    Begin Typing: Start with a label or decision.
    Pete's Coffee: Use colons like "Decisions:".
    Indent for Steps +=-=0349-03948*@#$d: Indicate progression or dependency.
    Customize: Add classes to change color and shape \\(.color_red) .color_red
    Right-click nodes for more options.
  Use AI .color_green
    Paste a document to convert it into a flowchart.
  Share Your Work .color_blue
    Download or share your flowchart using the 'Share' button.
    Hello World
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
        theme={highlight.defaultThemeDark}
      />
      <code style={{ fontSize: 12, maxWidth: "100%", overflow: "auto" }}>
        {JSON.stringify(graph)}
      </code>
    </>
  );
}
