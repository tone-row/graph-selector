import { describe, expect, test } from "vitest";
import { parse } from "./parse";
import { ParseError } from "./ParseError";
import { realisticDoc, rng } from "../bench/generate";

const SNIPPETS = [
  "a",
  " b",
  "\n",
  "\n  ",
  ": ",
  "#x",
  ".red",
  "[w=1]",
  "(#x)",
  "(a)",
  "{",
  "\n}",
  "//",
  "\\(",
  "(",
];

function mutate(doc: string, seed: number) {
  const r = rng(seed);
  let s = doc;
  for (let i = 0; i < 4; i++) {
    const at = Math.floor(r() * (s.length + 1));
    s =
      s.slice(0, at) +
      SNIPPETS[Math.floor(r() * SNIPPETS.length)] +
      s.slice(at + Math.floor(r() * 3));
  }
  return s;
}

function outcome(text: string) {
  try {
    return parse(text);
  } catch (e) {
    expect(e).toBeInstanceOf(ParseError);
    return (e as ParseError).message;
  }
}

const docs = Array.from({ length: 300 }, (_, i) => {
  const doc = realisticDoc(5 + (i % 80), i + 1, { referenceRate: (i % 5) / 10 });
  return i % 2 ? mutate(doc, i) : doc;
});

describe("parse properties over generated documents", () => {
  test("only ParseErrors are thrown", () => {
    for (const doc of docs) outcome(doc);
  });

  test("a parse does not depend on what was parsed before it", () => {
    const alone = docs.map((doc) => outcome(doc));
    const interleaved = docs.map((doc, i) => {
      outcome(docs[(i * 7 + 3) % docs.length]!);
      return outcome(doc);
    });
    expect(interleaved).toEqual(alone);
  });

  test("every edge connects entities in the graph and edge ids are unique", () => {
    for (const doc of docs) {
      const graph = outcome(doc);
      if (typeof graph === "string") continue;
      const ids = new Set([...graph.nodes, ...graph.edges].map((entity) => entity.data.id));
      for (const edge of graph.edges) {
        expect(ids).toContain(edge.source);
        expect(ids).toContain(edge.target);
      }
      expect(new Set(graph.edges.map((edge) => edge.data.id)).size).toEqual(graph.edges.length);
    }
  });
});
