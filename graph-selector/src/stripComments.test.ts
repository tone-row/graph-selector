import { describe, expect, test } from "vitest";
// @ts-expect-error the fork's package.json "exports" hides its type declarations
import { strip } from "@tone-row/strip-comments";
import { stripComments } from "./stripComments";
import { realisticDoc, rng } from "../bench/generate";

const fork = (text: string): string => strip(text, { preserveNewlines: true });
const escapeUrls = (text: string) => text.replace(/(https?:)\/\//g, "$1\\/\\/");

const EDGE_CASES = [
  "a // line comment",
  "// whole line\nb",
  "a\n  // indented\nb",
  "a /* inline */ b",
  "a /* multi\nline\ncomment */\nb",
  "a /* unclosed\nb\nc",
  "a */ b",
  "/* a /* nested */ still? */ b",
  "/**/ after",
  "/***/ after",
  "/*! protected */ x",
  "//! protected",
  "x /*a*/\ny",
  "see https:\\/\\/example.com // c",
  '[url="http:\\/\\/x.com"] a',
  "ftp://host/path",
  '"quoted // not comment" x',
  "'single // hidden' x",
  "`tick // hidden` x",
  'say "open // c\nnext // d\nclose" e',
  "don't // c\nwon't",
  "a'b // c'",
  '"" // c',
  '""x" // c',
  'esc \\"q // c',
  '"a\\" // b" // c',
  "a \\/\\/ b",
  "a \\// b",
  "a \\\\// b",
  "# hash",
  "<!-- html -->",
  "-- sql",
  "a\r\nb // c\r\nd",
  "a // c\u2028b",
  "a /* x */\nb /* y */ c",
  "label \\n newline // c",
  "{ a // c\n}",
  "a: b // c",
  '"unterminated // c',
  '/* "a*/" b */ c',
  "/* \\*/ x */ y",
  '"""// c"',
  '\u00e9"a // b"',
  '"a\x01b" // c"',
  '"a\\" b // c',
  "a // c\u2029b",
  "_'x // y'",
];

const TOKENS = [
  ...["/", "*", "\\", '"', "'", "`", "\n", "\r", "\u2028", "\u2029", "\x01"],
  ...["a", "_", "\u00e9", "\u{1F600}", " ", "!", ":"],
  ...["/*", "*/", "//", "/**", "/*!", "*/\n", '\\"', "\\*", '"""', "\\\n"],
];

function fuzzCorpus(count: number, seed: number) {
  const r = rng(seed);
  return Array.from({ length: count }, () => {
    const length = 1 + Math.floor(r() * 40);
    return Array.from({ length }, () => TOKENS[Math.floor(r() * TOKENS.length)]).join("");
  });
}

const corpus = fuzzCorpus(20000, 7);

function mismatches(inputs: string[]) {
  return inputs
    .map((input) => ({ input, expected: fork(input), actual: stripComments(input) }))
    .filter(({ expected, actual }) => expected !== actual)
    .slice(0, 5);
}

describe("stripComments matches @tone-row/strip-comments", () => {
  test.each(EDGE_CASES)("%j", (input) => {
    expect(stripComments(input)).toBe(fork(input));
  });

  test("seeded fuzz corpus", () => {
    expect(mismatches(corpus)).toEqual([]);
  });

  test("realistic documents, raw and with URLs escaped as parse does", () => {
    const docs = [50, 500, 2000].flatMap((lines) =>
      [1, 2, 3, 4, 5].map((seed) => realisticDoc(lines, seed)),
    );
    expect(mismatches([...docs, ...docs.map(escapeUrls)])).toEqual([]);
  });
});

test("stripComments keeps the line count, which parse relies on for line numbers", () => {
  const lineCount = (text: string) => text.split("\n").length;
  const changed = [...EDGE_CASES, ...corpus].filter(
    (input) => lineCount(stripComments(input)) !== lineCount(input),
  );
  expect(changed.slice(0, 5)).toEqual([]);
});
