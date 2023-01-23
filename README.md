<img src="https://raw.githubusercontent.com/tone-row/graph-selector/main/examples/public/graph-selector-logo.png" width="200" />

# graph-selector

![Version](https://img.shields.io/npm/v/graph-selector)
![Coverage](https://img.shields.io/codecov/c/github/tone-row/graph-selector)
![License](https://img.shields.io/github/license/tone-row/graph-selector)
![Build](https://img.shields.io/github/checks-status/tone-row/graph-selector/main)

Graph Selector is a language for describing graphs (nodes and edges) and storing arbitrary data on those nodes and edges in plaintext.

### [Check out the Demos 💫](http://graph-selector-syntax.tone-row.com/)

## Installation

```bash
npm install graph-selector
```

## Usage

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

- **Uses indentation to create edges**

  ```
  Node A
    Node B
  ```

  This creates an edge from Node A to Node B.

- **Edge info is stored before a colon `:`**

  ```
  Node A
    goes to: Node B
  ```

  This creates an edge from Node A to Node B with the label `goes to`.

- **Uses CSS Selector syntax encode data on nodes & edges**

  Parses strings like `#id.class1.class2[n=4][m]` into:

  ```js
  {
    id: "id",
    classes: ".class1.class2",
    n: 4,
    m: true
  }
  ```

- **Uses parentheses to refer to nodes created elsewhere**

  For example, `(ref by label)` `(#ref-by-id)` `(.ref-by-class)`

  ```
  a
  #id b
  .class c
  d
    (a)
    (#id)
    (.class)
  ```

  This creates a graph with 4 nodes and 3 edges.

## Parsing Example

```
#a.class1[boolAttr] node 1 label
 the edge label [weight=100]: .class1[attr2="test"] node 2 label
```

<center>⤵️⤵️⤵️</center>

```jsonc
/* Output from example above */
{
  "nodes": [
    {
      "data": {
        "label": "node 1 label",
        "id": "a",
        "classes": ".class1",
        "boolAttr": true
      },
      "parser": {
        "lineNumber": 1
      }
    },
    {
      "data": {
        "label": "node 2 label",
        "id": "node 2 label1",
        "classes": ".class1",
        "attr2": "test"
      },
      "parser": {
        "lineNumber": 2
      }
    }
  ],
  "edges": [
    {
      "source": "a",
      "target": "node 2 label1",
      "parser": {
        "lineNumber": 2
      },
      "data": {
        "id": "a-node 2 label1-1",
        "label": "the edge label [weight=100]",
        "classes": ""
      }
    }
  ]
}
```

## Context

[A blog post](https://tone-row.com/blog/graph-syntax-css-selectors) explaining the thought-process behind this language.

## Developing

This is a monorepo containing a `/parser` (written in TS) and a website of `/examples` illustrating how you can use it.

Git clone, then install dependencies with `pnpm install`. Then you can start both the parser and the examples websites with `pnpm dev`.

### Debugging Tests

In VS Code, debugging tests can be done by selecting `Javascript Debug Terminal` from the command palette. Then you can run `pnpm test:watch` to run the tests in debug mode and stop on breakpoints. (Leaving this here because I haven't been able to make it work any other way!)

If you want to run a single test you can use the `-t` flag on the command line and pass the test's name `pnpm test -- -t "the name of my test"`

## Project Goals

Become stable-enough to migrate https://flowchart.fun to this syntax and use it as the basis for a new version of the site.

### Next Steps

- Add benchmarks
- Add syntax highlighter packages that can be used with Monaco & CodeMirror

## Contributing

The goal of this project was to improve upon and separately-publish the parser used in Flowchart Fun. I want to make it more robust and more flexible. I also want to make it accessible to other projects.

I'm very open to contributions! Specifically in the following ways...

### Contributing to the Conversation

I'm really interested in feedback on the syntax and how it can be improved. Join the conversation via Github discussions or by opening an issue. Some open problems I'm interested in solving:

1. Automatic ID's by position vs. by label
1. Indenting below pointers

_I realize this is a bit vague. I intend to write a blog post explaining these problems and their inherent tradeoffs soon!_

### Contributing an Example

Examples show how this syntax and parser can be used to render different types of graphs using a variety of libraries, including [D3](https://d3js.org/), [Cytoscape JS](https://js.cytoscape.org/), and [Recharts](https://recharts.org/).

Add an example by first adding a route to `examples/src/Router.tsx` and then adding a page `examples/src/pages`. If your example uses a different renderer, you'll need to set the `type` property in the route, and then add that type to the side bar in `examples/src/App.tsx`.
