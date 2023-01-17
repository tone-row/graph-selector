import { Graph, parse, toCytoscapeElements } from "graph-selector";
import { useEffect, useState } from "react";

import { CustomEditor } from "../components/CustomEditor";
import { CyGraph } from "../components/CyGraph";
import { NextExample } from "../components/NextExample";
import { ShowParsed } from "../components/ShowParsed";
import { TitleDescription } from "../components/TitleDescription";
import { isError } from "../utils/isError";

const startingCode = `[src="https://i.ibb.co/N3r6Fy1/Screen-Shot-2023-01-11-at-2-22-31-PM.png"]
  [src="https://i.ibb.co/xgZXHG0/Screen-Shot-2023-01-11-at-2-22-36-PM.png"]
    [src="https://i.ibb.co/k6SgRvb/Screen-Shot-2023-01-11-at-2-22-41-PM.png"]
      [src="https://i.ibb.co/34TTCqM/Screen-Shot-2023-01-11-at-2-22-47-PM.png"]

Encoded Svgs {
  [src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%3E%3Cpath%20d%3D%22M9.5%2019c0%203.59%202.91%206.5%206.5%206.5s6.5-2.91%206.5-6.5-2.91-6.5-6.5-6.5-6.5%202.91-6.5%206.5zM30%208h-7c-0.5-2-1-4-3-4h-8c-2%200-2.5%202-3%204h-7c-1.1%200-2%200.9-2%202v18c0%201.1%200.9%202%202%202h28c1.1%200%202-0.9%202-2v-18c0-1.1-0.9-2-2-2zM16%2027.875c-4.902%200-8.875-3.973-8.875-8.875s3.973-8.875%208.875-8.875c4.902%200%208.875%203.973%208.875%208.875s-3.973%208.875-8.875%208.875zM30%2014h-4v-2h4v2z%22%20fill%3D%22%23000000%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E']
    #bounds[src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20height%3D%22120%22%20width%3D%22120%22%20viewBox%3D%22-10%20-10%20%20110%20110%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3Cfilter%20id%3D%22dropshadow%22%3E%0A%20%20%3CfeGaussianBlur%20in%3D%22SourceAlpha%22%20stdDeviation%3D%224%22/%3E%20%0A%20%20%3CfeOffset%20dx%3D%222%22%20dy%3D%222%22/%3E%0A%20%20%3CfeComponentTransfer%3E%0A%20%20%20%20%3CfeFuncA%20type%3D%22linear%22%20slope%3D%220.4%22/%3E%0A%20%20%3C/feComponentTransfer%3E%0A%20%20%3CfeMerge%3E%20%0A%20%20%20%20%3CfeMergeNode/%3E%0A%20%20%20%20%3CfeMergeNode%20in%3D%22SourceGraphic%22/%3E%20%0A%20%20%3C/feMerge%3E%0A%3C/filter%3E%0A%20%20%3C/defs%3E%0A%20%20%3Crect%20width%3D%2280%22%20height%3D%2280%22%20stroke%3D%22black%22%20stroke-width%3D%221%22%0A%20%20fill%3D%22white%22%20filter%3D%22url%28%23dropshadow%29%22%20rx%3D%228%22%20/%3E%0A%3C/svg%3E'][w=100][h=100]
}
`;

export function WithImages() {
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
        pageTitle="With Images"
        pageDescription={
          <p>
            Different techniques can be used to display images in different
            contexts. This example displays an image if a "src" data attribute
            is passed to a node.
          </p>
        }
      />
      <h2>Input</h2>
      <CustomEditor
        h={400}
        value={code}
        onChange={(newCode) => newCode && setCode(newCode)}
      />
      <h2>Output</h2>
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <ShowParsed parsed={parsed} />
      )}
      <CyGraph
        elements={elements as any}
        style={[
          {
            selector: "node",
            style: {
              "background-color": "white",
            },
          },
          {
            selector: "node[src]",
            style: {
              "background-image": "data(src)",
              "background-fit": "contain",
              "background-opacity": 0.5,
              shape: "rectangle",
            },
          },
          {
            selector: "node[src][w]",
            style: {
              width: "data(w)",
            },
          },
          {
            selector: "node[src][h]",
            style: {
              height: "data(h)",
            },
          },
          {
            selector: "#bounds",
            style: {
              "background-clip": "none",
              "bounds-expansion": 10,
            },
          },
        ]}
      />
      <NextExample />
    </div>
  );
}
