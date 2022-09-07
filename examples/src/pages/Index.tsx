import { Link } from "@tanstack/react-location";
import { TitleDescription } from "../components/TitleDescription";

export function Index() {
  return (
    <div className="page home">
      <TitleDescription
        pageTitle="Graph Selector Syntax"
        pageDescription={
          <>
            <p>
              The goal of this site is to show how this syntax (and the parser)
              can produce useful data for lots of different types of data
              visualizations.
            </p>
            <p>
              For context, this syntax was created as the successor to the
              current syntax on{" "}
              <a href="https://flowchart.fun">Flowchart Fun</a>.
            </p>
            <p>
              More information about how I arrived at this syntax, you can check
              out the blog post:{" "}
              <a href="https://tone-row.com/blog/graph-syntax-css-selectors">
                https://tone-row.com/blog/graph-syntax-css-selectors
              </a>
              .
            </p>
          </>
        }
      />
      <p className="large">
        Github Repository:{" "}
        <a href="https://github.com/tone-row/graph-selector-syntax">
          tone-row/graph-selector-syntax
        </a>
      </p>

      <Link to="/labels-and-edges" className="link-to-example">
        Open the first example
      </Link>
    </div>
  );
}
