import { FiArrowRight } from "react-icons/fi";
import { Link } from "@tanstack/react-location";
import { TitleDescription } from "../components/TitleDescription";

export function Index() {
  return (
    <div className="page home">
      <img
        src="/graph-selector-logo.png"
        alt="Graph Selector"
        className="gs-logo"
      />
      <TitleDescription
        pageTitle="graph-selector"
        pageDescription={
          <>
            <p style={{ fontSize: "120%" }}>
              Graph Selector is a language for expressing graphs (nodes and
              edges), as well as storing arbitrary data on those nodes and
              edges.
            </p>
            <p>
              It's built for and used on{" "}
              <a href="https://flowchart.fun">Flowchart Fun</a> but it's
              designed to be agnostic of the visualization library.
            </p>
            <p>
              This site contains examples of Graph Selector being used with{" "}
              <a href="https://js.cytoscape.org/">Cytoscape.js</a>,{" "}
              <a href="https://d3js.org/">D3</a>, and{" "}
              <a href="https://recharts.org/">Recharts</a>.
            </p>
            <p>
              For more information about the thought-process behind this syntax
              check out{" "}
              <a href="https://tone-row.com/blog/graph-syntax-css-selectors">
                the original blog post
              </a>
              .
            </p>
          </>
        }
      />
      <p className="large">
        <strong style={{ marginRight: 10 }}>Github Repository:</strong>{" "}
        <a href="https://github.com/tone-row/graph-selector">
          tone-row/graph-selector
        </a>
      </p>
      <div>
        <p className="large">
          <strong style={{ marginRight: 10 }}>Getting Started</strong>
          <code
            style={{
              display: "inline-block",
              padding: "0.5rem",
              background: "rgba(0, 0, 0, 0.05)",
              borderRadius: "0.25rem",
              fontSize: "1.25rem",
              fontFamily: "monospace",
            }}
          >
            npm install graph-selector
          </code>
        </p>
      </div>

      <Link
        to="/labels-and-edges"
        className="link-to-example"
        aria-label="Open First Example"
      >
        <FiArrowRight size={24} />
      </Link>
    </div>
  );
}
