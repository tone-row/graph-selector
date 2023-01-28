import { removeClassFromNode } from "./removeClassFromNode";

describe("removeClassFromNode", () => {
  it("removes a class from a node", () => {
    const result = removeClassFromNode({
      line: "my node .some-class",
      className: "some-class",
    });
    expect(result).toBe("my node");
  });

  it("doesn't alter if class isn't present", () => {
    const result = removeClassFromNode({
      line: "my node",
      className: "some-class",
    });
    expect(result).toBe("my node");
  });

  it("removes a class from a node with trailing classes", () => {
    const result = removeClassFromNode({
      line: "my node .some-class.another-class",
      className: "some-class",
    });
    expect(result).toBe("my node .another-class");
  });

  it("removes a class from a node with leading classes", () => {
    const result = removeClassFromNode({
      line: "my node .some-class.another-class",
      className: "another-class",
    });
    expect(result).toBe("my node .some-class");
  });

  it("removes a class from a node with leading and trailing classes", () => {
    const result = removeClassFromNode({
      line: "my node .some-class.another-class.yet-another-class",
      className: "another-class",
    });
    expect(result).toBe("my node .some-class.yet-another-class");
  });

  it("removes a class from a node and doesn't affect indentation", () => {
    const result = removeClassFromNode({
      line: "  my node .some-class",
      className: "some-class",
    });
    expect(result).toBe("  my node");
  });

  it("removes a class from a node without affecting the edge", () => {
    const result = removeClassFromNode({
      line: "  edge .some-class: my node .some-class",
      className: "some-class",
    });
    expect(result).toBe("  edge .some-class: my node");
  });
});
