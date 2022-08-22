# graph-selector-syntax

_A syntax for graphs._

For context, I'm experimenting with this language to determine if it should become the successor to the current [flowchart-fun](https://github.com/tone-row/flowchart-fun) language. I wrote [a blog post](https://flowchart.fun/blog/2019/05/19/graph-selector-syntax) explaining my thought process.

[**Check out the Examples**](http://graph-selector-syntax.vercel.app/)

## What does the syntax look like?

- indentation to create edges
- edge labels before a colon `:`
- _css-selector-ish-looking_ supplementary data for nodes
- reference sets of nodes in parentheses `(ref by label)` `(#ref-by-id)` `(.ref-by-class)`

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

## Contributing

### Contributing to the conversation

I'm really interested in feedback on the syntax and how it can be improved. Head to the github discussions page and join the conversation.

### Contributing an example

### Adding an Example
