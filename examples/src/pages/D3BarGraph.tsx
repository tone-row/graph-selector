// @ts-nocheck
import * as d3 from "d3";

import { useEffect, useRef, useState } from "react";

import { Editor } from "../components/Editor";
import { ShowParsed } from "../components/ShowParsed";
import { isError } from "./isError";
import { parse } from "parser";

const startingCode = `[price=4] label a
[price=3] label b
[price=5] label c
[price=2] label d
`;

export function D3BarGraph() {
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
      <h1>D3 Bar Graph</h1>
      <p>
        This example shows how we can use data attributes but using a d3 bar
        graph this time.
      </p>
      <Editor
        h={140}
        value={code}
        onChange={(newCode) => newCode && setCode(newCode)}
      />
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <ShowParsed parsed={parsed} />
          <D3Graph
            data={
              parsed
                ? parsed.nodes.map((node) => ({
                    price: parseInt(node.price, 10),
                    name: node.label,
                  }))
                : []
            }
          />
        </>
      )}
    </div>
  );
}

function D3Graph({ data }: { data: { price: number; name: string }[] }) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) return;
    let currentDiv = divRef.current;

    // set the dimensions and margins of the graph
    const margin = 60,
      width = 460 - margin - margin,
      height = 400 - margin - margin;

    // append the svg object to the body of the page
    var svg = d3
      .select("#my_dataviz")
      .append("svg")
      .attr("width", width + margin + margin)
      .attr("height", height + margin + margin)
      .append("g")
      .attr("transform", "translate(" + margin + "," + margin + ")");

    const xScale = d3.scaleBand().range([0, width]).padding(0.2);
    const yScale = d3.scaleLinear().range([height, 0]);

    // create a group
    const g = svg.append("g");

    // use data to update axis with domains
    xScale.domain(data.map((d, i) => d.name));
    yScale.domain([0, d3.max(data, (d) => d.price)]);

    // append x axis to group
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "translate(-10,0) rotate(-45)")
      .style("text-anchor", "end");

    // append y axis to group
    g.append("g").call(d3.axisLeft(yScale));

    // append rects to group
    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(d.name))
      .attr("y", (d) => yScale(d.price))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.price));

    return () => {
      currentDiv.innerHTML = "";
    };
  }, [data]);

  return (
    <div className="renderer">
      <div id="my_dataviz" ref={divRef} style={{ width: 460, height: 400 }} />
    </div>
  );
}
