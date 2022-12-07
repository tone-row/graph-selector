// @ts-nocheck
import * as d3 from "d3";
import * as d3Sankey from "d3-sankey";

import { Graph, parse } from "graph-selector";
import { useEffect, useRef, useState } from "react";

import { Editor } from "../components/Editor";
import { NextExample } from "../components/NextExample";
import { ShowParsed } from "../components/ShowParsed";
import { TitleDescription } from "../components/TitleDescription";
import { isError } from "../utils/isError";

const startingCode = `Thing One
Thing Two
Thing Three
Thing Four .a
Thing Five .a

(Thing One)
  [amt=15]: (Thing Two)
  [amt=20]: (Thing Three)

(Thing Two)
  [amt=12]: (Thing Four)
  [amt=20]: (Thing Five)

(Thing Three)
  [amt=6]: (.a)`;

export function SankeyDiagram() {
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

  const links = parsed
    ? parsed.edges.map((edge) => {
        const source = parsed.nodes.find(
          (node) => node.data.id === edge.source
        );
        const target = parsed.nodes.find(
          (node) => node.data.id === edge.target
        );
        if (!source || !target) return null;
        return {
          source: source.data.label,
          target: target.data.label,
          value: edge.data.amt,
        };
      })
    : [];

  return (
    <div className="page">
      <TitleDescription
        pageTitle="Sankey Diagram"
        pageDescription={
          <p>
            Sankey Diagrams are a good example of how data stored on an edge can
            be used.
          </p>
        }
      />
      <h2>Input</h2>
      <Editor
        h={430}
        value={code}
        onChange={(newCode) => newCode && setCode(newCode)}
      />
      <h2>Output</h2>
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <ShowParsed parsed={parsed} />
      )}
      {links.length && <D3Graph links={links} />}
      <NextExample />
    </div>
  );
}

function D3Graph({ links = [] }: { links?: any[] }) {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!divRef.current) return;
    let currentDiv = divRef.current;

    // set the dimensions and margins of the graph
    const margin = 20,
      width = 460 - margin - margin,
      height = 400 - margin - margin;

    SankeyChart(
      { links },
      {
        nodeGroup: (d) => d.id, // take first word for color
        nodeAlign: "justify", // e.g., d3.sankeyJustify; set by input above
        linkColor: "source-target", // e.g., "source" or "target"; set by input above
        format: (
          (f) => (d) =>
            `${f(d)} TWh`
        )(d3.format(",.1~f")),
        width,
        height,
      }
    );

    return () => {
      currentDiv.innerHTML = "";
    };
  }, [links]);

  return (
    <div className="renderer">
      <div id="my_dataviz" ref={divRef} style={{ width: 440, height: 440 }} />
    </div>
  );
}

// Borrowed from https://observablehq.com/@d3/sankey
function SankeyChart(
  { nodes, links },
  {
    format = ",",
    align = "justify",
    nodeId = (d) => d.id,
    nodeGroup,
    nodeGroups,
    nodeLabel,
    nodeTitle = (d) => `${d.id}\n${format(d.value)}`,
    nodeAlign = align,
    nodeWidth = 15,
    nodePadding = 10,
    nodeLabelPadding = 6,
    nodeStroke = "currentColor",
    nodeStrokeWidth,
    nodeStrokeOpacity,
    nodeStrokeLinejoin,
    linkSource = ({ source }) => source,
    linkTarget = ({ target }) => target,
    linkValue = ({ value }) => value,
    linkPath = d3Sankey.sankeyLinkHorizontal(),
    linkTitle = (d) => `${d.source.id} → ${d.target.id}\n${format(d.value)}`,
    linkColor = "source-target",
    linkStrokeOpacity = 0.5,
    linkMixBlendMode = "multiply",
    colors = d3.schemeTableau10,
    width = 640,
    height = 400,
    marginTop = 5,
    marginRight = 1,
    marginBottom = 5,
    marginLeft = 1,
  } = {}
) {
  // Compute values.
  const LS = d3.map(links, linkSource).map(intern);
  const LT = d3.map(links, linkTarget).map(intern);
  const LV = d3.map(links, linkValue);
  if (nodes === undefined)
    nodes = Array.from(d3.union(LS, LT), (id) => ({ id }));
  const N = d3.map(nodes, nodeId).map(intern);
  const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);

  // Replace the input nodes and links with mutable objects for the simulation.
  nodes = d3.map(nodes, (_, i) => ({ id: N[i] }));
  links = d3.map(links, (_, i) => ({
    source: LS[i],
    target: LT[i],
    value: LV[i],
  }));

  // Ignore a group-based linkColor option if no groups are specified.
  if (!G && ["source", "target", "source-target"].includes(linkColor))
    linkColor = "currentColor";

  // Compute default domains.
  if (G && nodeGroups === undefined) nodeGroups = G;

  // Construct the scales.
  const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

  // Compute the Sankey layout.
  d3Sankey
    .sankey()
    .nodeId(({ index: i }) => N[i])
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .extent([
      [marginLeft, marginTop],
      [width - marginRight, height - marginBottom],
    ])({ nodes, links });

  // Compute titles and labels using layout nodes, so as to access aggregate values.
  if (typeof format !== "function") format = d3.format(format);
  const Tl =
    nodeLabel === undefined
      ? N
      : nodeLabel == null
      ? null
      : d3.map(nodes, nodeLabel);
  const Tt = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
  const Lt = linkTitle == null ? null : d3.map(links, linkTitle);

  // A unique identifier for clip paths (to avoid conflicts).
  const uid = `O-${Math.random().toString(16).slice(2)}`;

  const svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const node = svg
    .append("g")
    .attr("stroke", nodeStroke)
    .attr("stroke-width", nodeStrokeWidth)
    .attr("stroke-opacity", nodeStrokeOpacity)
    .attr("stroke-linejoin", nodeStrokeLinejoin)
    .selectAll("rect")
    .data(nodes)
    .join("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0);

  if (G) node.attr("fill", ({ index: i }) => color(G[i]));
  if (Tt) node.append("title").text(({ index: i }) => Tt[i]);

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", linkStrokeOpacity)
    .selectAll("g")
    .data(links)
    .join("g")
    .style("mix-blend-mode", linkMixBlendMode);

  if (linkColor === "source-target")
    link
      .append("linearGradient")
      .attr("id", (d) => `${uid}-link-${d.index}`)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", (d) => d.source.x1)
      .attr("x2", (d) => d.target.x0)
      .call((gradient) =>
        gradient
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", ({ source: { index: i } }) => color(G[i]))
      )
      .call((gradient) =>
        gradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", ({ target: { index: i } }) => color(G[i]))
      );

  link
    .append("path")
    .attr("d", linkPath)
    .attr(
      "stroke",
      linkColor === "source-target"
        ? ({ index: i }) => `url(#${uid}-link-${i})`
        : linkColor === "source"
        ? ({ source: { index: i } }) => color(G[i])
        : linkColor === "target"
        ? ({ target: { index: i } }) => color(G[i])
        : linkColor
    )
    .attr("stroke-width", ({ width }) => Math.max(1, width))
    .call(
      Lt
        ? (path) => path.append("title").text(({ index: i }) => Lt[i])
        : () => {}
    );

  if (Tl)
    svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("x", (d) =>
        d.x0 < width / 2 ? d.x1 + nodeLabelPadding : d.x0 - nodeLabelPadding
      )
      .attr("y", (d) => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
      .text(({ index: i }) => Tl[i]);

  function intern(value) {
    return value !== null && typeof value === "object"
      ? value.valueOf()
      : value;
  }

  return Object.assign(svg.node(), { scales: { color } });
}
