"use client";

import * as d3 from "d3";

import { useEffect, useRef } from "react";

export function D3Graph({
  data,
  id,
}: {
  data: { price: number; name: string }[];
  id: string;
}) {
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
      .select(`#${id}`)
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
    yScale.domain([0, d3.max(data, (d) => d.price) as number]);

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
      .attr("x", (d) => xScale(d.name) as number)
      .attr("y", (d) => yScale(d.price))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.price));

    return () => {
      currentDiv.innerHTML = "";
    };
  }, [data, id]);

  return (
    <div className="renderer">
      <div id={id} ref={divRef} style={{ width: 460, height: 400 }} />
    </div>
  );
}
