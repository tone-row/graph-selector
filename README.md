# graph-selector-syntax

_A syntax for graphs._

For context, I'm experimenting with this language to determine if it should become the successor to the current [flowchart-fun](https://github.com/tone-row/flowchart-fun) language. I wrote [a blog post](https://tone-row.com/blog/graph-syntax-css-selectors) explaining my thought process.

[**Check out the Examples**](http://graph-selector-syntax.vercel.app/)

## What does this syntax look like?

- indentation to create edges
- edge labels before a colon `:`
- _css-selector-ish-looking_ supplementary data for nodes
- point to nodes/edges using parentheses `(ref by label)` `(#ref-by-id)` `(.ref-by-class)`

```
#a.class1.class2[attr=value] node label
 edge label: #b.class1[attr=value] another label
```

## What does the parser output look like?

- kept as flat as possible
- everything parses to strings for now (no numbers, no booleans)

```jsonc
/* output from example above */
{
  "nodes": [
    {
      "lineNumber": 1,
      "label": "node label",
      "id": "a",
      "classes": ".class1.class2",
      "attr": "value"
    },
    {
      "lineNumber": 2,
      "label": "another label",
      "id": "b",
      "classes": ".class1",
      "attr": "value"
    }
  ],
  "edges": [
    {
      "id": "a-b-1",
      "lineNumber": 2,
      "source": "a",
      "target": "b",
      "label": "edge label"
    }
  ]
}
```

## In this repository

This is a monorepo containing a `/parser` (written in TS) and a website of `/examples` illustrating how you can use it.

## Developing

This is a monorepo using pnpm. Git clone, then install dependencies with `pnpm install`. Then you can start both the parser and the examples websites with `pnpm dev`.

## How are graphs rendered?

One of the main goals of this project is to detatch the rendering from the parsing. The examples show how this syntax and parser can be used to render different types of graphs using a variety of libraries, including [D3](https://d3js.org/), [Cytoscape JS](https://js.cytoscape.org/), and [Recharts](https://recharts.org/).

## Next Steps

- add relevant tests from Flowchart Fun parser
- add package containing syntax highlighter that can be used with Monaco, eventually for CodeMirrora as well
- create NPM package

## Contributing

Very open to contributions! Specifically in the following ways:

### Contributing to the conversation

I'm really interested in feedback on the syntax and how it can be improved. Head to the github discussions page and join the conversation.

### Contributing an example

Add an example by first adding a route to `examples/src/Router.tsx` and then adding a page `examples/src/pages`. If your example uses a different renderer, you'll need to set the `type` property in the route, and then add that type to the side bar in `examples/src/App.tsx`.
