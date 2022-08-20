import * as d3 from "d3";

import { useEffect, useRef, useState } from "react";

// import { chord as Chord } from "d3-chord";
import { Editor } from "../components/Editor";
import { ShowParsed } from "../components/ShowParsed";
import { isError } from "./isError";
import { parse } from "parser";

const startingCode = `#a[size=4] label a
#b[size=3] label b
#c[size=5] label c
#d[size=2] label d

(#a)
  (#c)
  (#d)
(#b)
  (#d)
`;

export function ChordDiagram() {
  const [code, setCode] = useState(startingCode);
  const [error, setError] = useState("");
  const [parsed, setParsed] = useState<null | any>(null);
  useEffect(() => {
    try {
      // TODO: fix the Graph type, it's not correct anymore
      setParsed(parse(code) as any);
    } catch (e) {
      setParsed(null);
      if (isError(e)) setError(e.message);
    }
  }, [code]);
  return (
    <div className="page">
      <h1>Chord Diagram</h1>
      <p>
        This example shows how we can use data attributes and edges in the same
        rendering.
      </p>
      <Editor
        value={code}
        onChange={(newCode) => newCode && setCode(newCode)}
      />
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <ShowParsed parsed={parsed} />
      )}
      <D3Graph />
    </div>
  );
}

function D3Graph() {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!divRef.current) return;
    let currentDiv = divRef.current;

    // set the dimensions and margins of the graph
    const margin = 20,
      width = 460 - margin - margin,
      height = 400 - margin - margin;

    // append the svg object to the body of the page
    var svg = d3
      .select("#my_dataviz")
      .append("svg")
      .attr("width", 440)
      .attr("height", 440)
      .append("g")
      .attr("transform", "translate(220,220)");

    const matrix = [
      [0, 0, 1],
      [10, 1, 1],
      [4, 0, 0],
      // [20, 3, 7, 9],
      // [20, 3, 7, 9],
      // [20, 3, 7, 9],
    ];

    var res = d3
      .chord()
      .padAngle(0.0) // padding between entities (black arc)
      .sortSubgroups(d3.descending)(matrix);

    // add the groups on the inner part of the circle
    svg
      .datum(res)
      .append("g")
      .selectAll("g")
      .data(function (d) {
        return d.groups;
      })
      .enter()
      .append("g")
      .append("path")
      .style("fill", "grey")
      .style("stroke", "black")
      // @ts-ignore
      .attr("d", d3.arc().innerRadius(200).outerRadius(210));

    // Add the links between groups
    svg
      .datum(res)
      .append("g")
      .selectAll("path")
      .data(function (d) {
        return d;
      })
      .enter()
      .append("path")
      // @ts-ignore
      .attr("d", d3.ribbon().radius(200))
      .style("fill", (d) => {
        return "#" + Math.floor(Math.random() * 16777215).toString(16);
      })
      .style("stroke", "black");

    return () => {
      currentDiv.innerHTML = "";
    };
  }, []);

  return (
    <div className="renderer">
      <div id="my_dataviz" ref={divRef} style={{ width: 440, height: 440 }} />
    </div>
  );
}
