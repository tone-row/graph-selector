import * as Collapsible from "@radix-ui/react-collapsible";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Graph, parse } from "parser";
import { useEffect, useState } from "react";

import { Editor } from "../components/Editor";
import { NextExample } from "../components/NextExample";
import { TitleDescription } from "../components/TitleDescription";

const startingCode = `[c2us=200894][us2c=53361] 1955 to 1959
[c2us=240033][us2c=58707] 1960 to 1964
[c2us=193095][us2c=94902] 1965 to 1969
[c2us=95252][us2c=123191] 1970 to 1974
[c2us=84333][us2c=69920] 1975 to 1979
[c2us=83059][us2c=44148] 1980 to 1984
[c2us=64976][us2c=28438] 1985 to 1988`;

const toPercent = (decimal: number, fixed = 0) =>
  `${(decimal * 100).toFixed(0)}%`;

function CustomizedAxisTick(props: any) {
  const { x, y, stroke, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-35)"
      >
        {payload.value}
      </text>
    </g>
  );
}

export function TabularData() {
  const [code, setCode] = useState(startingCode);
  const [error, setError] = useState("");
  const [parsed, setParsed] = useState<null | Graph>(null);
  useEffect(() => {
    try {
      // TODO: fix the Graph type, it's not correct anymore
      setParsed(parse(code) as any);
    } catch (e) {
      setParsed(null);
      if (isError(e)) setError(e.message);
    }
  }, [code]);

  const data: any = parsed
    ? [
        ...parsed.nodes.map((node) => ({
          years: node.label,
          c2us: parseInt(node.c2us as string, 10),
          us2c: parseInt(node.us2c as string, 10),
        })),
      ]
    : [];
  return (
    <div className="page">
      <TitleDescription
        pageTitle="Tabular Data"
        pageDescription={
          <p>
            An example using data from
            <a href="https://www2.census.gov/library/publications/1990/demographics/p23-161.pdf">
              this random document
            </a>
            . Migration between US and Canada from 1955-1988 (Page 9).
          </p>
        }
      />
      <h2>Input</h2>
      <Editor
        value={code}
        onChange={(newCode) => newCode && setCode(newCode)}
      />
      <h2>Output</h2>
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <Collapsible.Root>
          <Collapsible.Trigger>Show Parsed Value</Collapsible.Trigger>
          <Collapsible.Content>
            <pre>
              <code>{JSON.stringify(parsed, null, 2)}</code>
            </pre>
          </Collapsible.Content>
        </Collapsible.Root>
      )}
      <h2 style={{ textAlign: "center" }}>
        Percentage Migration between US &amp; Canada
      </h2>
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
      <NextExample />
    </div>
  );
}

export function isError(value: unknown): value is Error {
  return value instanceof Error;
}
