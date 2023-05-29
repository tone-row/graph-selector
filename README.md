# Graph Selector

![Version](https://img.shields.io/npm/v/graph-selector)
![Coverage](https://img.shields.io/codecov/c/github/tone-row/graph-selector)
![License](https://img.shields.io/github/license/tone-row/graph-selector)
![Build](https://img.shields.io/github/checks-status/tone-row/graph-selector/main)

Graph Selector is a language for describing graphs (nodes and edges) and storing arbitrary data on those nodes and edges in plaintext.

## 💫 Check out the Demos

Visit the demo page at [graph-selector-syntax.tone-row.com](http://graph-selector-syntax.tone-row.com/) to see how it works.

## Introduction

Graph Selector is a syntax for defining graphs and the data associated with them. Graphs are defined in plain-text and can be parsed into a programmable JavaScript object. This makes it easier for developers to work with graphs when building applications like web applications, database applications, and process-visualization systems.

Graph Selector uses indentation and context-free grammars to create edges between nodes and store data. It also has features like matchers and models to make modeling complex graphs easier and faster.

## Usage

You can use Graph Selector in your projects by installing it using npm:

```bash
npm install graph-selector
```

You can then use Graph Selector in your code to parse Graph Selector strings:

```js
import { parse } from "graph-selector";

const graph = parse(`
Node A
  goes to: Node B
`);

const { nodes, edges } = graph;

// do something with nodes and edges...
```

## Language Overview

Graph Selector has a few rules that make it easy to understand and use:

Indentation is used to create edges between nodes.

```
Node A
  Node B
```

This creates an edge from Node A to Node B.

Edge info is stored before a colon (`:`) and is separated from the node info by a space.

```
Node A
  goes to: Node B
```

This creates an edge from Node A to Node B with the label `goes to`.

Data can be stored on the nodes and edges using CSS Selector syntax. For example, `#id.class1.class2[n=4][m]` would be parsed into:

```js
{
  "id": "id",
  "classes": ".class1.class2",
  "n": 4,
  "m": true
}
```

Parentheses can be used to reference nodes that have already been declared.

```
a
b  #id
c .class
d
  (a)
  (#id)
  (.class)
```

This creates a graph with 4 nodes and 3 edges.

## Errors

In order to capture and display parsing errors in the editor, errors conform to the type `ParsingError` in `graph-selector/src/ParseError.ts`. Because in most application we imagine parsing will occur outside of the editor, displaying errors must also happen outside the error. A simple version of what that would look with monaco is below:

## Context

If you would like to find out more about the development and thought process behind this language, [A blog post](https://tone-row.com/blog/graph-syntax-css-selectors) has been published.

## Contributing

Constructive feedback on the syntax and how it can be improved is the primary contribution sought by this project. You can contribute by having a discussion via Github discissions or opening an issue. Additionally, pull requests will be welcomed to help make the project more robust and flexible for developers.

You can also contribute examples that show how Graph Selector can be used to render various types of graphs with a variety of libraries, including [D3](https://d3js.org/), [Cytoscape JS](https://js.cytoscape.org/), and [Recharts](https://recharts.org/).

## Developing

Clone the repo, then install dependencies with `pnpm install`. You can then start both the parser and the examples website with `pnpm dev`.

## Goals

The goal of this project is to become stable enough to migrate the [Flowchart Fun](https://flowchart.fun) website to this syntax and use it as the basis for a new version.

### Next Steps

- ~~Add syntax highlighter packages that can be used with Monaco & CodeMirror.~~
- Add benchmarks
