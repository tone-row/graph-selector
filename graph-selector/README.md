# graph-selector

👀 [https://github.com/tone-row/graph-selector-syntax](https://github.com/tone-row/graph-selector-syntax)

## Installation

```bash
npm install graph-selector
```

## Usage

```js
import { parse } from "graph-selector";

const graph = parse(`
  #a.class1.class2[attr=value] node label
   edge label: #b.class1[attr=value] another label
`);

const { nodes, edges } = graph;

console.log(nodes, edges);
```

## Demo

[Click here to view examples](http://graph-selector-syntax.tone-row.com/)
