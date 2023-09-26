import {
  Attributes,
  ClassConnections,
  D3BarGraph,
  EdgesLabels,
  IdsClasses,
  Images,
  SankeyDiagram,
  TabularData,
} from "@/components/Sections";
import { FaArrowRight, FaGithub, FaTwitter } from "react-icons/fa";
import { Sponsor, Stars } from "@/components/GithubButtons";

import { Nav } from "../components/Nav";
import { SyntaxHighlighter } from "@/components/SyntaxHighlighter";

/* eslint-disable @next/next/no-img-element */
export default function Home() {
  return (
    <div className="page max-w-5xl p-4 mx-auto grid gap-12 min-h-screen content-start">
      <header className="grid items-baseline justify-between grid-flow-col">
        <h1 className="text-xl text-indigo-700 font-bold">Graph Selector</h1>
        <div className="right flex gap-3 items-center text-[0px]">
          <a
            href="https://twitter.com/tone_row_"
            className="text-neutral-400 hover:text-neutral-500"
          >
            <FaTwitter size={16} />
          </a>
          <Stars />
          <Sponsor />
        </div>
      </header>
      <Banner />
      <main className="main grid content-start gap-8 items-start">
        <Nav />
        <div className="grid gap-8">
          <Section
            title="A Concise Demonstration"
            description={`A quick example showing how Graph Selector gets us from an encoding to a working graph in seconds.`}
          >
            <iframe
              src="https://stackblitz.com/edit/typescript-enwuzx?embed=1&file=index.ts"
              style={{ width: "100%", height: "500px", border: 0 }}
            ></iframe>
          </Section>
          <Section
            title="Installation"
            description={`To add graph-selector to your project, install it with the package manager of your preference.`}
          >
            <SyntaxHighlighter>
              {`npm install graph-selector`}
            </SyntaxHighlighter>
          </Section>
          <Section
            title="ID's & Classes"
            description={`Use CSS style selectors to add ID's and classes to nodes in your graph.`}
          >
            <IdsClasses />
          </Section>
          <Section
            title="Creating Edges with Labels"
            description={`Create directed edges between nodes using indentation and add labels to them with text before the colon (:).`}
          >
            <EdgesLabels />
          </Section>
          <Section
            title="Class Connections"
            description={`Use classes to create different types of relationships between nodes and edges in your graph.`}
          >
            <ClassConnections />
          </Section>
          <Section
            title="Attributes"
            description={`Learn how to use data attribute syntax to store data on nodes that impacts the graph that is rendered.`}
          >
            <Attributes />
          </Section>
          <Section
            title="D3 Bar Graph"
            description={`Create a d3 bar graph from data attributes stored on nodes.`}
          >
            <D3BarGraph />
          </Section>
          <Section
            title="Sankey Diagram"
            description={`Create data-driven Sankey diagrams to visualize flows.`}
          >
            <SankeyDiagram />
          </Section>
          <Section
            title="Images"
            description={`Use different techniques to display images in different contexts in your graph.`}
          >
            <Images />
          </Section>
          <Section
            title="Tabular Data"
            description={`Use tabular data to create your graph, such as US-Canada migration data from 1955-1988.`}
          >
            <TabularData />
          </Section>
          <Section
            title="Support Us"
            description="Please consider donating to our open-source efforts to help us develop and improve Graph Selector!"
          >
            <Sponsor />
          </Section>
        </div>
      </main>
    </div>
  );
}

function Banner() {
  return (
    <div className="banner grid gap-4 max-w-xl">
      <h2 className="text-2xl tracking-tight">
        Describe graphs and their associated data in an expressive, agnostic syntax.
      </h2>
      <p className="text-sm">
        Graph Selector is a language for expressing graphs, such as nodes and
        edges, and storing arbitrary data on those nodes and edges. It can be
        used in conjunction with a variety of visualization libraries such as
        Cytoscape.js, D3, and Recharts, and is designed to be agnostic of the
        visualization library.
      </p>
      <div className="flex justify-start gap-2">
        <a
          className="flex justify-start items-center gap-2 py-2 px-4 bg-indigo-700 text-white rounded active:bg-indigo-900 hover:bg-indigo-800"
          href="#installation"
        >
          Get started <FaArrowRight size={16} />
        </a>
        <a
          href="https://github.com/tone-row/graph-selector"
          className="flex justify-start items-center gap-2 py-2 px-4 bg-white text-indigo-700 rounded border-2 border-indigo-700 hover:bg-indigo-700 hover:text-white active:bg-indigo-800"
        >
          <FaGithub size={20} />
          Github
        </a>
      </div>
      <p className="text-sm">
        Made with ❤️ by{" "}
        <a
          href="https://twitter.com/tone_row_"
          className="text-indigo-600 hover:underline"
        >
          Tone Row
        </a>
        .
      </p>
    </div>
  );
}

function Section({
  title,
  children,
  description,
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z- 0-9]/g, "")
    .replace(/ {2,}/g, " ")
    .replace(/\s/g, "-");
  return (
    <section id={slug} className="section grid gap-4 bg-white p-4 rounded">
      <header className="grid">
        <h3 className="text-2xl font-bold">{title}</h3>
        {description && (
          <p className="text-sm text-neutral-700">{description}</p>
        )}
      </header>
      {children}
    </section>
  );
}
