import { describe, expect, it, test } from "vitest";
import { removeClassesFromEdge } from "./removeClassesFromEdge";

describe("removeClassesFromEdge", () => {
  it("removes a classf rom an edge", () => {
    const result = removeClassesFromEdge({
      line: ".some-class edge: my node",
      classNames: ["some-class"],
    });
    expect(result).toBe("edge: my node");
  });

  it("doesn't alter if class isn't present", () => {
    const result = removeClassesFromEdge({
      line: "edge: my node",
      classNames: ["some-class"],
    });
    expect(result).toBe("edge: my node");
  });

  it("removes a class from an edge with trailing classes", () => {
    const result = removeClassesFromEdge({
      line: ".some-class.another-class edge: my node",
      classNames: ["some-class"],
    });
    expect(result).toBe(".another-class edge: my node");
  });

  it("removes a class from an edge with leading classes", () => {
    const result = removeClassesFromEdge({
      line: ".some-class.another-class edge: my node",
      classNames: ["another-class"],
    });
    expect(result).toBe(".some-class edge: my node");
  });

  it("removes a class from an edge with leading and trailing classes", () => {
    const result = removeClassesFromEdge({
      line: ".some-class.another-class.yet-another-class edge: my node",
      classNames: ["another-class"],
    });
    expect(result).toBe(".some-class.yet-another-class edge: my node");
  });

  it("removes a class from an edge and doesn't affect indentation", () => {
    const result = removeClassesFromEdge({
      line: "  .some-class edge: my node",
      classNames: ["some-class"],
    });
    expect(result).toBe("  edge: my node");
  });

  it("removes a class from an edge without affecting the node", () => {
    const result = removeClassesFromEdge({
      line: "  .some-class edge: my node .some-class",
      classNames: ["some-class"],
    });
    expect(result).toBe("  edge: my node .some-class");
  });

  it("can remove multiple classes at once", () => {
    const result = removeClassesFromEdge({
      line: ".some-class.another-class edge: my node",
      classNames: ["some-class", "another-class"],
    });
    expect(result).toBe("edge: my node");
  });

  it("can remove class when no edge label", () => {
    const result = removeClassesFromEdge({
      line: "  .some-class: my node",
      classNames: ["some-class"],
    });
    expect(result).toBe("  my node");
  });

  it("can remove edge class when starting container line", () => {
    const result = removeClassesFromEdge({
      line: "  .some-class edge: container {",
      classNames: ["some-class"],
    });
    expect(result).toBe("  edge: container {");
  });

  it("should not remove partial class", () => {
    const result = removeClassesFromEdge({
      line: "  .some-class edge: my node",
      classNames: ["some"],
    });
    expect(result).toBe("  .some-class edge: my node");
  });

  it("should not remove partial class when valid part of label", () => {
    const result = removeClassesFromEdge({
      line: "  period.cool: my node",
      classNames: ["cool"],
    });
    expect(result).toBe("  period.cool: my node");
  });

  it("doesn't remove class from node obviously", () => {
    const result = removeClassesFromEdge({
      line: "  my node .some-class",
      classNames: ["some-class"],
    });
    expect(result).toBe("  my node .some-class");
  });

  test("should remove class when it abuts data", () => {
    let line = "  .e[multiple-words][x=1000] hello: hi";
    line = removeClassesFromEdge({
      line,
      classNames: ["e"],
    });
    expect(line).toBe("  [multiple-words][x=1000] hello: hi");
  });

  // bug directly from flowchart.fun
  test("shouldn't leave stray classes", () => {
    let line = "  .roundrectangle[w=100][h=70] label: cool";
    line = removeClassesFromEdge({
      line,
      classNames: ["rectangle"],
    });
    expect(line).toBe("  .roundrectangle[w=100][h=70] label: cool");
  });
});
