"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomizedAxisTick, toPercent } from "./ReCharts";
import { Graph, parse, toCytoscapeElements } from "graph-selector";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { CytoscapeGraph } from "./CytoscapeGraph";
import { D3Graph } from "./D3Graph";
import { Editor } from "./Editor";
import { FaGripLinesVertical } from "react-icons/fa";
import { SankeyChart } from "./SankeyChart";
import { useReducer } from "react";

type State = {
  result: Graph;
  error: string;
  code: string;
};
const useCode = (initialCode: string) => {
  return useReducer(
    (s: State, n: string): State => {
      try {
        const result = parse(n);
        return { result, error: "", code: n };
      } catch (e) {
        return {
          result: { nodes: [], edges: [] },
          error: (e as Error).message,
          code: n,
        };
      }
    },
    {
      result: { nodes: [], edges: [] },
      error: "",
      code: initialCode,
    } as State,
    (initial: State) => {
      try {
        const result = parse(initial.code);
        return { result, error: "", code: initial.code };
      } catch (e) {
        return {
          result: { nodes: [], edges: [] },
          error: (e as Error).message,
          code: initial.code,
        };
      }
    }
  );
};

const idsClasses = `This is a label #a.large
  (#c)
This is a longer label #b
  (#c)
The longest label text of all #c`;
export function IdsClasses() {
  const [state, dispatch] = useCode(idsClasses);
  return (
    <PanelGroup direction="horizontal">
      <Panel>
        <Editor
          value={state.code}
          onChange={(value) => dispatch(value || "")}
        />
      </Panel>
      <PanelResizeHandle className="resize-handle grid place-content-center text-neutral-300 hover:text-neutral-600">
        <FaGripLinesVertical />
      </PanelResizeHandle>
      <Panel>
        <CytoscapeGraph elements={toCytoscapeElements(state.result)} />
      </Panel>
    </PanelGroup>
  );
}

const edgesLabels = `a\n\tto: b\n\tc\n\t\tgoes to: d\n\nA Container {\n\thello world\n\t\t(b)\n}`;
export function EdgesLabels() {
  const [state, dispatch] = useCode(edgesLabels);
  return (
    <PanelGroup direction="horizontal">
      <Panel>
        <Editor
          value={state.code}
          onChange={(value) => dispatch(value || "")}
        />
      </Panel>
      <PanelResizeHandle className="resize-handle grid place-content-center text-neutral-300 hover:text-neutral-600">
        <FaGripLinesVertical />
      </PanelResizeHandle>
      <Panel>
        <CytoscapeGraph elements={toCytoscapeElements(state.result)} />
      </Panel>
    </PanelGroup>
  );
}

const classConnections = `X .a
Y .a
Z .a

one to many
  (.a)

X .b
Y .b
Z .b

(.b)
  many to one

many to many .c
X .c
Y .d
Z .d

(.c)
  (.d)`;

export function ClassConnections() {
  const [state, dispatch] = useCode(classConnections);
  return (
    <PanelGroup direction="horizontal">
      <Panel>
        <Editor
          value={state.code}
          onChange={(value) => dispatch(value || "")}
        />
      </Panel>
      <PanelResizeHandle className="resize-handle grid place-content-center text-neutral-300 hover:text-neutral-600">
        <FaGripLinesVertical />
      </PanelResizeHandle>
      <Panel>
        <CytoscapeGraph elements={toCytoscapeElements(state.result)} />
      </Panel>
    </PanelGroup>
  );
}

const attributes = `Mercury [size=2.439]
  Venus [size=6.052]
    Earth [size=6.371]
      Mars [size=3.390]
        Jupiter [size=69.911]
          Saturn [size=58.232]
            Uranus [size=25.362]
              Neptune [size=24.622]`;
export function Attributes() {
  const [state, dispatch] = useCode(attributes);
  return (
    <PanelGroup direction="horizontal">
      <Panel>
        <Editor
          value={state.code}
          onChange={(value) => dispatch(value || "")}
        />
      </Panel>
      <PanelResizeHandle className="resize-handle grid place-content-center text-neutral-300 hover:text-neutral-600">
        <FaGripLinesVertical />
      </PanelResizeHandle>
      <Panel>
        <CytoscapeGraph
          elements={toCytoscapeElements(state.result)}
          containerStyle={{ backgroundColor: "#000" }}
          style={[
            {
              selector: "node",
              style: {
                width: "data(size)",
                height: "data(size)",
                label: "data(label)",
                backgroundColor: "#fac39a",
                color: "white",
                "font-size": 10,
              },
            },
            {
              selector: "edge",
              style: {
                "target-arrow-shape": "triangle",
                width: 1,
                "target-distance-from-node": 10,
                "source-distance-from-node": 10,
                "line-style": "dashed",
                "line-color": "#fff",
                "target-arrow-color": "#fff",
              },
            },
          ]}
        />
      </Panel>
    </PanelGroup>
  );
}

const d3BarGraph = `Item 1 [price=4]
Item 2 [price=3]
Item 3 [price=5]
Item 4 [price=12]
`;
export function D3BarGraph() {
  const [state, dispatch] = useCode(d3BarGraph);
  const prices = state.result.nodes
    .filter((node) => node.data?.price)
    .map((node) => ({
      price: parseInt(node.data.price.toString(), 10),
      name: node.data.label,
    }));
  return (
    <PanelGroup direction="horizontal">
      <Panel>
        <Editor
          value={state.code}
          onChange={(value) => dispatch(value || "")}
        />
      </Panel>
      <PanelResizeHandle className="resize-handle grid place-content-center text-neutral-300 hover:text-neutral-600">
        <FaGripLinesVertical />
      </PanelResizeHandle>
      <Panel>
        <D3Graph id="bar-graph" data={prices} />
      </Panel>
    </PanelGroup>
  );
}

const sankeyDiagram = `Thing One
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
  const [state, dispatch] = useCode(sankeyDiagram);
  const links = state.result
    ? state.result.edges.map((edge) => {
        const source = state.result.nodes.find(
          (node) => node.data.id === edge.source
        );
        const target = state.result.nodes.find(
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
  console.log(links);
  return (
    <PanelGroup direction="horizontal">
      <Panel>
        <Editor
          value={state.code}
          onChange={(value) => dispatch(value || "")}
        />
      </Panel>
      <PanelResizeHandle className="resize-handle grid place-content-center text-neutral-300 hover:text-neutral-600">
        <FaGripLinesVertical />
      </PanelResizeHandle>
      <Panel>{links.length && <SankeyChart links={links} />}</Panel>
    </PanelGroup>
  );
}

const images = `[src="https://i.ibb.co/N3r6Fy1/Screen-Shot-2023-01-11-at-2-22-31-PM.png"]
  [src="https://i.ibb.co/xgZXHG0/Screen-Shot-2023-01-11-at-2-22-36-PM.png"]
    [src="https://i.ibb.co/k6SgRvb/Screen-Shot-2023-01-11-at-2-22-41-PM.png"]
      [src="https://i.ibb.co/34TTCqM/Screen-Shot-2023-01-11-at-2-22-47-PM.png"]

Encoded Svgs {
  [src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%3E%3Cpath%20d%3D%22M9.5%2019c0%203.59%202.91%206.5%206.5%206.5s6.5-2.91%206.5-6.5-2.91-6.5-6.5-6.5-6.5%202.91-6.5%206.5zM30%208h-7c-0.5-2-1-4-3-4h-8c-2%200-2.5%202-3%204h-7c-1.1%200-2%200.9-2%202v18c0%201.1%200.9%202%202%202h28c1.1%200%202-0.9%202-2v-18c0-1.1-0.9-2-2-2zM16%2027.875c-4.902%200-8.875-3.973-8.875-8.875s3.973-8.875%208.875-8.875c4.902%200%208.875%203.973%208.875%208.875s-3.973%208.875-8.875%208.875zM30%2014h-4v-2h4v2z%22%20fill%3D%22%23000000%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E']
    #bounds[src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20height%3D%22120%22%20width%3D%22120%22%20viewBox%3D%22-10%20-10%20%20110%20110%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3Cfilter%20id%3D%22dropshadow%22%3E%0A%20%20%3CfeGaussianBlur%20in%3D%22SourceAlpha%22%20stdDeviation%3D%224%22/%3E%20%0A%20%20%3CfeOffset%20dx%3D%222%22%20dy%3D%222%22/%3E%0A%20%20%3CfeComponentTransfer%3E%0A%20%20%20%20%3CfeFuncA%20type%3D%22linear%22%20slope%3D%220.4%22/%3E%0A%20%20%3C/feComponentTransfer%3E%0A%20%20%3CfeMerge%3E%20%0A%20%20%20%20%3CfeMergeNode/%3E%0A%20%20%20%20%3CfeMergeNode%20in%3D%22SourceGraphic%22/%3E%20%0A%20%20%3C/feMerge%3E%0A%3C/filter%3E%0A%20%20%3C/defs%3E%0A%20%20%3Crect%20width%3D%2280%22%20height%3D%2280%22%20stroke%3D%22black%22%20stroke-width%3D%221%22%0A%20%20fill%3D%22white%22%20filter%3D%22url%28%23dropshadow%29%22%20rx%3D%228%22%20/%3E%0A%3C/svg%3E'][w=100][h=100]
}
`;

export function Images() {
  const [state, dispatch] = useCode(images);
  return (
    <PanelGroup direction="horizontal">
      <Panel>
        <Editor
          value={state.code}
          onChange={(value) => dispatch(value || "")}
        />
      </Panel>
      <PanelResizeHandle className="resize-handle grid place-content-center text-neutral-300 hover:text-neutral-600">
        <FaGripLinesVertical />
      </PanelResizeHandle>
      <Panel>
        <CytoscapeGraph
          elements={toCytoscapeElements(state.result)}
          style={[
            {
              selector: "node",
              style: {
                "background-color": "white",
              },
            },
            {
              selector: "node[src]",
              style: {
                "background-image": "data(src)",
                "background-fit": "contain",
                "background-opacity": 0.5,
                shape: "rectangle",
              },
            },
            {
              selector: "node[src][w]",
              style: {
                width: "data(w)",
              },
            },
            {
              selector: "node[src][h]",
              style: {
                height: "data(h)",
              },
            },
            {
              selector: "#bounds",
              style: {
                "background-clip": "none",
                "bounds-expansion": 10,
              },
            },
          ]}
        />
      </Panel>
    </PanelGroup>
  );
}

const tabularData = `1955 to 1959 [c2us=200894][us2c=53361]
1960 to 1964 [c2us=240033][us2c=58707]
1965 to 1969 [c2us=193095][us2c=94902]
1970 to 1974 [c2us=95252][us2c=123191]
1975 to 1979 [c2us=84333][us2c=69920]
1980 to 1984 [c2us=83059][us2c=44148]
1985 to 1988 [c2us=64976][us2c=28438]`;
export function TabularData() {
  const [state, dispatch] = useCode(tabularData);
  const data: any = state.result
    ? [
        ...state.result.nodes.map((node) => ({
          years: node.data.label,
          c2us: parseInt(node.data.c2us as string, 10),
          us2c: parseInt(node.data.us2c as string, 10),
        })),
      ]
    : [];
  return (
    <PanelGroup direction="horizontal">
      <Panel>
        <Editor
          value={state.code}
          onChange={(value) => dispatch(value || "")}
        />
      </Panel>
      <PanelResizeHandle className="resize-handle grid place-content-center text-neutral-300 hover:text-neutral-600">
        <FaGripLinesVertical />
      </PanelResizeHandle>
      <Panel>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            width={500}
            height={400}
            data={data}
            stackOffset="expand"
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 65,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="years" tick={<CustomizedAxisTick />} />
            <YAxis tickFormatter={toPercent} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="us2c"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
              label="US to Canada"
            />
            <Area
              type="monotone"
              dataKey="c2us"
              stackId="1"
              stroke="#ffc658"
              fill="#ffc658"
              label={`Canada to US`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>
    </PanelGroup>
  );
}
