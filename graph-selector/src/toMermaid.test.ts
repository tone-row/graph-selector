import { parse } from "./parse";
import { toMermaid } from "./toMermaid";

describe("toMermaid", () => {
  test("should create nodes", () => {
    const graph = parse(`a\nb`);
    const mermaid = toMermaid(graph);
    expect(mermaid).toEqual(`flowchart\n\tn1["a"]\n\tn2["b"]`);
  });

  test("should create edges", () => {
    const graph = parse(`a\n  b`);
    const mermaid = toMermaid(graph);
    expect(mermaid).toEqual(`flowchart\n\tn1["a"]\n\tn2["b"]\n\tn1 --> n2`);
  });

  test("renders edge labels", () => {
    const graph = parse(`a\n  label: b`);
    const mermaid = toMermaid(graph);
    expect(mermaid).toEqual(`flowchart\n\tn1["a"]\n\tn2["b"]\n\tn1 -- "label" --> n2`);
  });

  test("renders nodes with no label", () => {
    const graph = parse(`.classonly`);
    const mermaid = toMermaid(graph);
    expect(mermaid).toEqual(`flowchart\n\tn1[" "]`);
  });

  test("supports shape classes", () => {
    const graph = parse(`ellipse .ellipse\ncircle .circle\ndiamond .diamond\n`);
    const mermaid = toMermaid(graph);
    expect(mermaid).toEqual(`flowchart\n\tn1(["ellipse"])\n\tn2(("circle"))\n\tn3{"diamond"}`);
  });

  test("Escapes characters in labels", () => {
    const graph = parse(`a\n  b & c < d > e \" f`);
    const mermaid = toMermaid(graph);
    expect(mermaid).toEqual(
      `flowchart\n\tn1["a"]\n\tn2["b &amp; c &lt; d &gt; e &quot; f"]\n\tn1 --> n2`,
    );
  });

  test("Supports containers / subgraphs", () => {
    const graph = parse(`a {\n  b\n}`);
    const mermaid = toMermaid(graph);
    expect(mermaid).toEqual(`flowchart\n\tsubgraph n1 ["a"]\n\t\tn2["b"]\n\tend`);
  });

  test("Supports containers with edges within them", () => {
    const graph = parse(`a {\n  b\n    c\n}`);
    const mermaid = toMermaid(graph);
    expect(mermaid).toEqual(
      `flowchart\n\tsubgraph n1 ["a"]\n\t\tn2["b"]\n\t\tn3["c"]\n\tend\n\tn2 --> n3`,
    );
  });

  test("Supports adjacent containers", () => {
    const graph = parse(`a {\n  b\n}\nc {\n  d\n}`);
    const mermaid = toMermaid(graph);
    expect(mermaid).toEqual(
      `flowchart\n\tsubgraph n1 ["a"]\n\t\tn2["b"]\n\tend\n\tsubgraph n4 ["c"]\n\t\tn5["d"]\n\tend`,
    );
  });

  test("Supports linking between containers", () => {
    const graph = parse(`a {\n  b\n}\n\t(c)\nc {\n  d\n    (b)\n}`);
    const mermaid = toMermaid(graph);
    expect(mermaid).toEqual(
      `flowchart\n\tsubgraph n1 ["a"]\n\t\tn2["b"]\n\tend\n\tsubgraph n5 ["c"]\n\t\tn6["d"]\n\tend\n\tn1 --> n5\n\tn6 --> n2`,
    );
  });
});
