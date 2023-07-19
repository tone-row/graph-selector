import { removeClassesFromNode } from "./removeClassesFromNode";

describe("removeClassFromNode", () => {
  it("removes a class from a node", () => {
    const result = removeClassesFromNode({
      line: "my node .some-class",
      classNames: ["some-class"],
    });
    expect(result).toBe("my node");
  });

  it("doesn't alter if class isn't present", () => {
    const result = removeClassesFromNode({
      line: "my node",
      classNames: ["some-class"],
    });
    expect(result).toBe("my node");
  });

  it("removes a class from a node with trailing classes", () => {
    const result = removeClassesFromNode({
      line: "my node .some-class.another-class",
      classNames: ["some-class"],
    });
    expect(result).toBe("my node .another-class");
  });

  it("removes a class from a node with leading classes", () => {
    const result = removeClassesFromNode({
      line: "my node .some-class.another-class",
      classNames: ["another-class"],
    });
    expect(result).toBe("my node .some-class");
  });

  it("removes a class from a node with leading and trailing classes", () => {
    const result = removeClassesFromNode({
      line: "my node .some-class.another-class.yet-another-class",
      classNames: ["another-class"],
    });
    expect(result).toBe("my node .some-class.yet-another-class");
  });

  it("removes a class from a node and doesn't affect indentation", () => {
    const result = removeClassesFromNode({
      line: "  my node .some-class",
      classNames: ["some-class"],
    });
    expect(result).toBe("  my node");
  });

  it("removes a class from a node without affecting the edge", () => {
    const result = removeClassesFromNode({
      line: "  edge .some-class: my node .some-class",
      classNames: ["some-class"],
    });
    expect(result).toBe("  edge .some-class: my node");
  });

  it("can remove multiple classes at once", () => {
    const result = removeClassesFromNode({
      line: "  edge .some-class: my node .some-class.another-class",
      classNames: ["some-class", "another-class"],
    });
    expect(result).toBe("  edge .some-class: my node");
  });

  test("shouldn't grow when removing class on containers", () => {
    let line = "hello .world {";
    line = removeClassesFromNode({
      line,
      classNames: ["world"],
    });
    expect(line).toBe("hello {");
  });

  test("doesn't remove a partial class", () => {
    let line = "hello .some-class";
    line = removeClassesFromNode({
      line,
      classNames: ["some"],
    });
    expect(line).toBe("hello .some-class");
  });

  test("should remove class when it abuts data", () => {
    let line = "hello .e[multiple-words][x=1000]";
    line = removeClassesFromNode({
      line,
      classNames: ["e"],
    });
    expect(line).toBe("hello [multiple-words][x=1000]");
  });

  // bug directly from flowchart.fun
  test("shouldn't leave stray classes", () => {
    let line = "label .roundrectangle[w=100][h=70]";
    line = removeClassesFromNode({
      line,
      classNames: ["rectangle"],
    });
    expect(line).toBe("label .roundrectangle[w=100][h=70]");
  });
});
